package com.talentshare.backend.service;

import com.talentshare.backend.exception.BusinessException;
import com.talentshare.backend.model.*;
import com.talentshare.backend.repository.GroupeRepository;
import com.talentshare.backend.repository.KeywordMappingRepository;
import com.talentshare.backend.repository.UserRepository;
import com.talentshare.backend.repository.UtilisateurRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UtilisateurServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private UtilisateurRepository utilisateurRepository;
    @Mock
    private GroupeRepository groupeRepository;
    @Mock
    private KeywordMappingRepository keywordMappingRepository;

    @InjectMocks
    private UtilisateurService utilisateurService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetCurrentUserProfile_Success() {
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom("Maram Drira");
        utilisateur.setEmail("maram@example.com");
        utilisateur.setLocation("Paris");
        utilisateur.setBio("Hello world");
        utilisateur.setTalents(Set.of("Music"));
        utilisateur.setSkills(Set.of("Guitar"));
        utilisateur.setLanguages(List.of("French"));

        when(utilisateurRepository.findByUser_Username("maramdrira"))
            .thenReturn(Optional.of(utilisateur));

        Map<String, Object> profile = utilisateurService.getCurrentUserProfile("maramdrira");

        assertEquals("Maram Drira", profile.get("nom"));
        assertEquals("maram@example.com", profile.get("email"));
        assertEquals("Paris", profile.get("location"));
        assertEquals("Hello world", profile.get("bio"));
    }

    @Test
    void testGetCurrentUserProfile_NotFound() {
        when(utilisateurRepository.findByUser_Username("nouser"))
            .thenReturn(Optional.empty());

        assertThrows(BusinessException.class, () -> {
            utilisateurService.getCurrentUserProfile("nouser");
        });
    }

    @Test
    void testUpdateCurrentUserProfile_UpdatesFields() {
        Utilisateur existingUser = new Utilisateur();
        existingUser.setNom("Old");
        existingUser.setLocation("OldLoc");
        existingUser.setBio("OldBio");

        Utilisateur updated = new Utilisateur();
        updated.setNom("New");
        updated.setLocation("NewLoc");
        updated.setBio("NewBio");

        when(utilisateurRepository.findByUser_Username("user"))
            .thenReturn(Optional.of(existingUser));

        utilisateurService.updateCurrentUserProfile("user", updated);

        verify(utilisateurRepository).save(argThat(u ->
            u.getNom().equals("New") &&
                u.getLocation().equals("NewLoc") &&
                u.getBio().equals("NewBio")
        ));
    }

    @Test
    void testGetGroupRecommendations_UserNotFound() {
        when(utilisateurRepository.findByUser_Username("invalidUser"))
            .thenReturn(Optional.empty());

        assertThrows(BusinessException.class, () ->
            utilisateurService.getGroupRecommendations("invalidUser"));
    }

    @Test
    void testGetGroupRecommendations_WithMappings() {
        User user = new User();
        user.setUsername("user");
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setUser(user);
        utilisateur.setTalents(Set.of("Java", "Leadership"));
        utilisateur.setSkills(Set.of("Spring"));
        utilisateur.setLanguages(List.of("Français"));

        when(userRepository.findByUsername("user")).thenReturn(Optional.of(user));
        when(utilisateurRepository.findByUser(user)).thenReturn(Optional.of(utilisateur));

        KeywordMapping mapping1 = mock(KeywordMapping.class);
        when(mapping1.getKeyword()).thenReturn("java");
        when(mapping1.getRelatedKeywords()).thenReturn(Set.of("backend"));

        KeywordMapping mapping2 = mock(KeywordMapping.class);
        when(mapping2.getKeyword()).thenReturn("leadership");
        when(mapping2.getRelatedKeywords()).thenReturn(Set.of("management"));

        when(keywordMappingRepository.findAll())
            .thenReturn(List.of(mapping1, mapping2));

        Groupe groupe1 = new Groupe();
        groupe1.setNom("Backend Devs");
        groupe1.setTags(Set.of("backend"));
        groupe1.setStatus(Groupe.GroupStatus.APPROVED);
        User creator1 = new User();
        creator1.setUsername("creator1");
        groupe1.setCreateur(creator1);

        Groupe groupe2 = new Groupe();
        groupe2.setNom("Leadership Circle");
        groupe2.setTags(Set.of("management"));
        groupe2.setStatus(Groupe.GroupStatus.APPROVED);
        User creator2 = new User();
        creator2.setUsername("creator2");
        groupe2.setCreateur(creator2);

        when(groupeRepository.findAll())
            .thenReturn(List.of(groupe1, groupe2));

        List<Groupe> result = utilisateurService.getGroupRecommendations("user");

        assertEquals(2, result.size());
    }

    @Test
    void testGetGroupRecommendations_Fallback() {
        User user = new User();
        user.setUsername("user1");

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setUser(user);
        utilisateur.setTalents(Set.of("Art"));
        utilisateur.setSkills(Set.of("Drawing"));
        utilisateur.setLanguages(List.of("English"));

        Groupe g1 = new Groupe();
        g1.setNom("Art Group");
        g1.setStatus(Groupe.GroupStatus.APPROVED);
        User creator = new User();
        creator.setUsername("creatorX");
        g1.setCreateur(creator);
        g1.setTags(Set.of("art", "painting"));

        when(userRepository.findByUsername("user1")).thenReturn(Optional.of(user));
        when(utilisateurRepository.findByUser(user)).thenReturn(Optional.of(utilisateur));
        when(keywordMappingRepository.findAll()).thenReturn(Collections.emptyList());
        when(groupeRepository.findAll()).thenReturn(List.of(g1));

        List<Groupe> result = utilisateurService.getGroupRecommendations("user1");

        assertNotNull(result);
        assertFalse(result.isEmpty());
    }
}
