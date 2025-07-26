package com.talentshare.backend.config;

import com.talentshare.backend.model.KeywordMapping;
import com.talentshare.backend.repository.KeywordMappingRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class KeywordDataInitializer {

    private final KeywordMappingRepository repository;

    @PostConstruct
    public void init() {
        if (repository.count() == 0) {
            List<KeywordMapping> mappings = List.of(
                new KeywordMapping("music", Set.of("singing", "playing piano", "guitar", "drumming", "music production", "DJing", "songwriting")),
                new KeywordMapping("sports", Set.of("football", "basketball", "tennis", "swimming", "athletics", "martial arts", "yoga", "cycling")),
                new KeywordMapping("programming", Set.of("Java", "Python", "C++", "web development", "algorithms", "Flutter", "React", "machine learning")),
                new KeywordMapping("design", Set.of("graphic design", "Figma", "Photoshop", "UI/UX", "illustration", "logo design", "motion design")),
                new KeywordMapping("communication", Set.of("public speaking", "negotiation", "active listening", "presentation", "teamwork", "conflict resolution", "storytelling")),
                new KeywordMapping("marketing", Set.of("SEO", "content creation", "social media", "email marketing", "branding", "Google Ads", "market research")),
                new KeywordMapping("entrepreneurship", Set.of("business planning", "pitching", "budgeting", "innovation", "team leadership", "problem solving", "startup strategy")),
                new KeywordMapping("writing", Set.of("creative writing", "copywriting", "technical writing", "editing", "storytelling", "blogging", "academic writing")),
                new KeywordMapping("language", Set.of("English", "French", "Spanish", "Arabic", "German", "Chinese", "translation", "interpretation")),
                new KeywordMapping("art", Set.of("painting", "drawing", "sculpting", "digital art", "calligraphy", "crafting", "origami")),
                new KeywordMapping("education", Set.of("tutoring", "mentoring", "e-learning", "curriculum design", "language teaching", "exam preparation")),
                new KeywordMapping("photography", Set.of("portrait photography", "editing", "lightroom", "nature photography", "wedding photography", "videography")),
                new KeywordMapping("technology", Set.of("cloud computing", "cybersecurity", "blockchain", "data science", "AI", "DevOps", "networking")),
                new KeywordMapping("finance", Set.of("accounting", "financial analysis", "budgeting", "cryptocurrency", "investing", "trading")),
                new KeywordMapping("volunteering", Set.of("community service", "event organization", "fundraising", "teaching kids", "environmental campaigns"))
            );
            repository.saveAll(mappings);
        }
    }
}

