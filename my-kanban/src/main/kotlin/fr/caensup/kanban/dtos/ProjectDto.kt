package fr.caensup.kanban.dtos

import java.util.UUID

data class ProjectDto(
    var id: UUID? = null,
    var name: String? = null,
    var description: String? = null,
    var creatorId: UUID? = null
)