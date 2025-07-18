package com.talentshare.backend.service;

import com.talentshare.backend.DTOs.PollChoiceDTO;
import com.talentshare.backend.DTOs.PollRequest;
import com.talentshare.backend.DTOs.PollResponse;
import com.talentshare.backend.exception.BusinessException;
import com.talentshare.backend.model.*;
import com.talentshare.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PollService {

    private final PollRepository pollRepo;
    private final PollVoteRepository voteRepo;
    private final PollChoiceRepository choiceRepo;
    private final UserRepository userRepo;
    private final GroupeRepository groupeRepo;
    private final SimpMessagingTemplate messagingTemplate;
    private final GroupeMembreRepository groupeMembreRepository;

    public PollResponse createPoll(String question, LocalDateTime endDate, List<String> choices, Long groupId, String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        Groupe groupe = groupeRepo.findById(groupId)
                .orElseThrow(() -> new BusinessException("Group not found"));

        GroupeMembre groupeMembre = groupeMembreRepository.findByGroupeAndUser(groupe, user)
                .orElseThrow(() -> new BusinessException("User is not a member of the group"));

        if (groupeMembre.getRole() != GroupeMembre.RoleGroupe.CREATEUR &&
                groupeMembre.getRole() != GroupeMembre.RoleGroupe.MODERATEUR) {
            throw new BusinessException("Not authorized to create polls in this group");
        }

        Poll poll = new Poll();
        poll.setQuestion(question);
        poll.setEndDate(endDate);
        poll.setGroupe(groupe);

        List<PollChoice> pollChoices = choices.stream().map(text -> {
            PollChoice choice = new PollChoice();
            choice.setText(text);
            choice.setPoll(poll);
            return choice;
        }).toList();

        poll.setChoices(pollChoices);
        pollRepo.save(poll);

        return mapToDto(poll);
    }

    public void vote(Long pollId, Long choiceId, String username) {
        Poll poll = pollRepo.findById(pollId)
                .orElseThrow(() -> new BusinessException("Poll not found"));

        if (poll.getEndDate().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Poll closed");
        }

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        Groupe groupe = poll.getGroupe();

        GroupeMembre groupeMembre = groupeMembreRepository.findByGroupeAndUser(groupe, user)
                .orElseThrow(() -> new BusinessException("User is not a member of the poll's group"));

        if (groupeMembre.getRole() != GroupeMembre.RoleGroupe.CREATEUR &&
                groupeMembre.getRole() != GroupeMembre.RoleGroupe.MODERATEUR &&
                groupeMembre.getRole() != GroupeMembre.RoleGroupe.MEMBRE) {
            throw new BusinessException("User is not authorized to vote in this group");
        }

        if (voteRepo.existsByPollAndUser(poll, user)) {
            throw new BusinessException("Already voted");
        }

        PollChoice choice = choiceRepo.findById(choiceId)
                .orElseThrow(() -> new BusinessException("Choice not found"));

        choice.setVoteCount(choice.getVoteCount() + 1);
        choiceRepo.save(choice);

        PollVote vote = new PollVote();
        vote.setPoll(poll);
        vote.setChoice(choice);
        vote.setUser(user);
        voteRepo.save(vote);

        Poll updatedPoll = pollRepo.findById(pollId).orElseThrow();
        messagingTemplate.convertAndSend("/topic/poll/" + pollId + "/results", mapToDto(updatedPoll));
    }

    public PollResponse getPollWithResults(Long pollId, String username) {
        Poll poll = pollRepo.findById(pollId)
                .orElseThrow(() -> new BusinessException("Poll not found"));
        PollVote vote = voteRepo.findByPollAndUser(poll, userRepo.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found")))
            .orElse(null);

        Long votedChoiceId = vote != null ? vote.getChoice().getId() : null;
        return mapToDto(poll, votedChoiceId);

    }
    private PollResponse mapToDto(Poll poll) {
        return mapToDto(poll, null);
    }

    private PollResponse mapToDto(Poll poll, Long votedChoiceId) {
        return new PollResponse(
                poll.getId(),
                poll.getQuestion(),
                poll.getEndDate(),
                poll.getChoices().stream()
                        .map(c -> new PollChoiceDTO(c.getId(), c.getText(), c.getVoteCount()))
                        .toList(),
                votedChoiceId
        );
    }
    public PollResponse editPoll(Long pollId, PollRequest updatedRequest, String username) {
        Poll poll = pollRepo.findById(pollId)
                .orElseThrow(() -> new BusinessException("Poll not found"));

        if (poll.getEndDate().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Poll already ended; cannot edit.");
        }

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        Groupe groupe = poll.getGroupe();
        GroupeMembre membre = groupeMembreRepository.findByGroupeAndUser(groupe, user)
                .orElseThrow(() -> new BusinessException("User is not a member of the poll's group"));

        if (membre.getRole() != GroupeMembre.RoleGroupe.CREATEUR &&
                membre.getRole() != GroupeMembre.RoleGroupe.MODERATEUR) {
            throw new BusinessException("Not authorized to edit this poll.");
        }

        poll.setQuestion(updatedRequest.getQuestion());
        poll.setEndDate(updatedRequest.getEndDate());

        pollRepo.save(poll);

        return mapToDto(poll);
    }

    public void deletePoll(Long pollId, String username) {
        Poll poll = pollRepo.findById(pollId)
                .orElseThrow(() -> new BusinessException("Poll not found"));

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        Groupe groupe = poll.getGroupe();

        GroupeMembre membre = groupeMembreRepository.findByGroupeAndUser(groupe, user)
                .orElseThrow(() -> new BusinessException("User is not a member of the poll's group"));

        if (membre.getRole() != GroupeMembre.RoleGroupe.CREATEUR &&
                membre.getRole() != GroupeMembre.RoleGroupe.MODERATEUR) {
            throw new BusinessException("Not authorized to delete this poll.");
        }

        pollRepo.delete(poll);
    }
    public void editPollChoice(Long choiceId, String newText, String username) {
        PollChoice choice = choiceRepo.findById(choiceId)
                .orElseThrow(() -> new BusinessException("Choice not found"));

        Poll poll = choice.getPoll();

        if (poll.getEndDate().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Poll already ended; cannot edit choice.");
        }

        if (!voteRepo.findByChoice(choice).isEmpty()) {
            throw new BusinessException("Cannot edit choice with votes.");
        }

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        Groupe groupe = poll.getGroupe();

        GroupeMembre membre = groupeMembreRepository.findByGroupeAndUser(groupe, user)
                .orElseThrow(() -> new BusinessException("User is not a member of the poll's group"));

        if (membre.getRole() != GroupeMembre.RoleGroupe.CREATEUR &&
                membre.getRole() != GroupeMembre.RoleGroupe.MODERATEUR) {
            throw new BusinessException("Not authorized to edit this choice.");
        }

        choice.setText(newText);
        choiceRepo.save(choice);
    }

    public void deletePollChoice(Long choiceId, String username) {
        PollChoice choice = choiceRepo.findById(choiceId)
                .orElseThrow(() -> new BusinessException("Choice not found"));

        if (!voteRepo.findByChoice(choice).isEmpty()) {
            throw new BusinessException("Cannot delete choice with votes.");
        }

        Poll poll = choice.getPoll();

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        Groupe groupe = poll.getGroupe();

        GroupeMembre membre = groupeMembreRepository.findByGroupeAndUser(groupe, user)
                .orElseThrow(() -> new BusinessException("User is not a member of the poll's group"));

        if (membre.getRole() != GroupeMembre.RoleGroupe.CREATEUR &&
                membre.getRole() != GroupeMembre.RoleGroupe.MODERATEUR) {
            throw new BusinessException("Not authorized to delete this choice.");
        }

        choiceRepo.delete(choice);
    }
    public void editVote(Long pollId, Long newChoiceId, String username) {
        Poll poll = pollRepo.findById(pollId)
                .orElseThrow(() -> new BusinessException("Poll not found"));

        if (poll.getEndDate().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Poll closed; cannot change vote.");
        }

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        PollVote vote = voteRepo.findByPollAndUser(poll, user)
                .orElseThrow(() -> new BusinessException("Vote not found"));

        PollChoice oldChoice = vote.getChoice();
        PollChoice newChoice = choiceRepo.findById(newChoiceId)
                .orElseThrow(() -> new BusinessException("New choice not found"));

        if (!newChoice.getPoll().getId().equals(pollId)) {
            throw new BusinessException("Choice does not belong to this poll.");
        }

        oldChoice.setVoteCount(oldChoice.getVoteCount() - 1);
        newChoice.setVoteCount(newChoice.getVoteCount() + 1);
        choiceRepo.save(oldChoice);
        choiceRepo.save(newChoice);

        vote.setChoice(newChoice);
        voteRepo.save(vote);

        Poll updatedPoll = pollRepo.findById(pollId).orElseThrow();
        messagingTemplate.convertAndSend("/topic/poll/" + pollId + "/results", mapToDto(updatedPoll));
    }
    public void deleteVote(Long pollId, String username) {
        Poll poll = pollRepo.findById(pollId)
                .orElseThrow(() -> new BusinessException("Poll not found"));

        if (poll.getEndDate().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Poll closed; cannot delete vote.");
        }

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        PollVote vote = voteRepo.findByPollAndUser(poll, user)
                .orElseThrow(() -> new BusinessException("Vote not found"));

        PollChoice choice = vote.getChoice();
        choice.setVoteCount(choice.getVoteCount() - 1);
        choiceRepo.save(choice);

        voteRepo.delete(vote);

        Poll updatedPoll = pollRepo.findById(pollId).orElseThrow();
        messagingTemplate.convertAndSend("/topic/poll/" + pollId + "/results", mapToDto(updatedPoll));
    }
    public List<PollResponse> getPollsByGroup(Long groupId) {
        List<Poll> polls = pollRepo.findByGroupeIdOrderByEndDateDesc(groupId);
        LocalDateTime now = LocalDateTime.now();
        return polls.stream()
                .filter(poll -> poll.getEndDate().isAfter(now))
                .map(this::mapToDto)
                .toList();
    }


}
