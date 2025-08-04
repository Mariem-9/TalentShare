package com.talentshare.backend.service;

import com.talentshare.backend.DTOs.PollResponse;
import com.talentshare.backend.exception.BusinessException;
import com.talentshare.backend.model.*;
import com.talentshare.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PollServiceTest {

    @Mock
    private PollRepository pollRepo;
    @Mock
    private PollVoteRepository voteRepo;
    @Mock
    private PollChoiceRepository choiceRepo;
    @Mock
    private UserRepository userRepo;
    @Mock
    private GroupeRepository groupeRepo;
    @Mock
    private GroupeMembreRepository groupeMembreRepository;
    @Mock
    private MessageRepository messageRepo;
    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private PollService pollService;

    private User testUser;
    private Groupe testGroupe;
    private GroupeMembre testMembre;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testUser = new User();
//        testUser.setId(1L);
        testUser.setUsername("testuser");

        testGroupe = new Groupe();
        testGroupe.setId(1L);
        testGroupe.setCreateur(testUser);

        testMembre = new GroupeMembre();
        testMembre.setUser(testUser);
        testMembre.setGroupe(testGroupe);
        testMembre.setRole(GroupeMembre.RoleGroupe.CREATEUR);
    }

//    @Test
//    void createPoll_success() {
//        when(userRepo.findByUsername("testuser")).thenReturn(Optional.of(testUser));
//        when(groupeRepo.findById(1L)).thenReturn(Optional.of(testGroupe));
//        when(groupeMembreRepository.findByGroupeAndUser(testGroupe, testUser)).thenReturn(Optional.of(testMembre));
//        when(pollRepo.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
//
//        List<String> choices = List.of("Choice 1", "Choice 2");
//        LocalDateTime endDate = LocalDateTime.now().plusDays(1);
//
//        PollResponse response = pollService.createPoll("Question?", endDate, choices, 1L, "testuser");
//
//        assertNotNull(response);
//        assertEquals("Question?", response.getQuestion());
//        assertEquals(2, response.getChoices().size());
//
//        verify(pollRepo, times(1)).save(any());
//    }

    @Test
    void createPoll_throwsWhenUserNotFound() {
        when(userRepo.findByUsername("unknown")).thenReturn(Optional.empty());

        BusinessException ex = assertThrows(BusinessException.class,
            () -> pollService.createPoll("Q?", LocalDateTime.now().plusDays(1), List.of("A"), 1L, "unknown"));

        assertEquals("User not found", ex.getMessage());
    }

//    @Test
//    void vote_success() {
//        Poll poll = new Poll();
//        poll.setId(1L);
//        poll.setEndDate(LocalDateTime.now().plusDays(1));
//        poll.setGroupe(testGroupe);
//
//        PollChoice choice = new PollChoice();
//        choice.setId(10L);
//        choice.setPoll(poll);
//        choice.setVoteCount(0);
//
//        when(pollRepo.findById(1L)).thenReturn(Optional.of(poll));
//        when(userRepo.findByUsername("testuser")).thenReturn(Optional.of(testUser));
//        when(groupeMembreRepository.findByGroupeAndUser(testGroupe, testUser)).thenReturn(Optional.of(testMembre));
//        when(voteRepo.existsByPollAndUser(poll, testUser)).thenReturn(false);
//        when(choiceRepo.findById(10L)).thenReturn(Optional.of(choice));
//        when(pollRepo.findById(1L)).thenReturn(Optional.of(poll));
//
//        pollService.vote(1L, 10L, "testuser");
//
//        assertEquals(1, choice.getVoteCount());
//        verify(choiceRepo).save(choice);
//        verify(voteRepo).save(any());
//        verify(messagingTemplate).convertAndSend(eq("/topic/poll/1/results"), any());
//    }

    @Test
    void vote_throwsIfPollClosed() {
        Poll poll = new Poll();
        poll.setId(1L);
        poll.setEndDate(LocalDateTime.now().minusDays(1));

        when(pollRepo.findById(1L)).thenReturn(Optional.of(poll));

        BusinessException ex = assertThrows(BusinessException.class,
            () -> pollService.vote(1L, 10L, "testuser"));

        assertEquals("Poll closed", ex.getMessage());
    }

    // Add more tests for other methods similarly...

}
