package com.talentshare.backend.model;

import jakarta.persistence.*;
import java.util.Set;
import lombok.*;

import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KeywordMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String keyword;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "related_keywords",
        joinColumns = @JoinColumn(name = "keyword_mapping_id")
    )
    @Column(name = "related_keyword")
    private Set<String> relatedKeywords;
    public KeywordMapping(String keyword, Set<String> relatedKeywords) {
        this.keyword = keyword;
        this.relatedKeywords = relatedKeywords;
    }
}


