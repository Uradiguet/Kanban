package fr.caensup.kanban.dtos

import java.util.UUID

data class ProjectDto(
    val id: UUID? = null,
    val name: String? = null,
    val description: String? = null,
)