package fr.caensup.kanban.services

import fr.caensup.kanban.dtos.UserDto
import fr.caensup.kanban.entities.User
import fr.caensup.kanban.repositories.UserRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class UserService(
    private val userRepository: UserRepository
) {
    fun findAll() = userRepository.findAll()
    fun findById(id: UUID) = userRepository.findById(id)
    fun save(user: UserDto) = userRepository.save(dtoToUser(user))
    fun deleteById(id: UUID) = userRepository.deleteById(id)
    fun dtoToUser(userDto: UserDto) = User(
        id = userDto.id ?: UUID.randomUUID(),
        login = userDto.login ?: "",
        password = userDto.password ?: "",
        email = userDto.email ?: "",
        firstname = userDto.firstname ?: "",
        lastname = userDto.lastname ?: ""
    )

}