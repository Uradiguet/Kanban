package fr.caensup.kanban.dtos

import java.util.UUID

data class UserDto(
    val id: UUID? = null,
    val login: String? = null,
    val password: String? = null,
    val email: String? = null,
    val firstname: String? = null,
    val lastname: String? = null,
) {
}