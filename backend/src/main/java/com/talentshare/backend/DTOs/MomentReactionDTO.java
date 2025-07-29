package com.talentshare.backend.DTOs;
import com.talentshare.backend.model.MomentReaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MomentReactionDTO {
    private Long id;
    private String type;
    private String username;
    private Long momentId;

    public MomentReactionDTO(MomentReaction reaction) {
        this.id = reaction.getId();
        this.type = reaction.getType().name();
        this.username = reaction.getUtilisateur().getUser().getUsername();
        this.momentId = reaction.getMoment().getId();
    }
}

