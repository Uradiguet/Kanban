package fr.caensup.kanban.dtos

import java.util.*

data class BoardDto(
    var id: UUID? = null,
    var title: String? = null,        // Frontend envoie "title"
    var name: String? = null,         // Backend utilise "name"
    var description: String? = null,
    var color: String = "bg-gray-100 border-gray-300",
    var position: Int = 0,
    var projectId: UUID? = null
)