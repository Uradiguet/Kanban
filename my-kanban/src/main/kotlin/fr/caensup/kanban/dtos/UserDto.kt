package fr.caensup.kanban.dtos

import java.util.*

data class UserDto(
    var id: UUID? = null,
    var email: String? = null,
    var password: String? = null,
    var firstname: String? = null,
    var lastname: String? = null,
    var username: String? = null
) {
}