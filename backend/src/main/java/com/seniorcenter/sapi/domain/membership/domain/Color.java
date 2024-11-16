package com.seniorcenter.sapi.domain.membership.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public enum Color {
    PEACH_PINK("#FFD1DC"),
    BABY_BLUE("#A2D5F2"),
    LAVENDER_PURPLE("#C3B1E1"),
    MINT_GREEN("#B5EAD7"),
    SOFT_YELLOW("#FFF8B5"),
    LIGHT_CORAL("#FFB5A7"),
    POWDER_BLUE("#B0E0E6"),
    ROSE_QUARTZ("#F7CAC9"),
    FRENCH_VANILLA("#FFF5D4"),
    LILAC("#D5C6E0"),
    APRICOT("#FFE0B2"),
    AQUA_BLUE("#A1E3D8"),
    PALE_PINK("#FADADD"),
    PALE_LIME("#E6F5C9"),
    DUSTY_ROSE("#E7C6C2"),
    PERIWINKLE("#C3DDF9"),
    GRAY("#808080");;

    private final String color;
}
