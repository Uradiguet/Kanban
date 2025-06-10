package fr.caensup.kanban.services

import fr.caensup.kanban.dtos.ProjectDto
import fr.caensup.kanban.dtos.UserDto
import fr.caensup.kanban.entities.Project
import fr.caensup.kanban.entities.User
import fr.caensup.kanban.repositories.ProjectRepository
import fr.caensup.kanban.repositories.UserRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class UserService(
        private val userRepository: UserRepository
) {
    fun findAll() = userRepository.findAll()
    fun findById(id: UUID) = userRepository.findById(id)
    fun save(userDto: UserDto) = userRepository.save(dtoToUser(userDto))
    fun deleteById(id: UUID) = userRepository.deleteById(id)
    fun dtoToUser(userDto: UserDto) = User(
            id = userDto.id ?: UUID.randomUUID(),
            username = userDto.username,
            email = userDto.email,
            password = userDto.password,
            firstname = userDto.firstname,
            lastname = userDto.lastname
    )
}