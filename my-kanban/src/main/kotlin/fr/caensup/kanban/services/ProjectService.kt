package fr.caensup.kanban.services

import fr.caensup.kanban.dtos.ProjectDto
import fr.caensup.kanban.entities.Project
import fr.caensup.kanban.repositories.ProjectRepository
import fr.caensup.kanban.repositories.UserRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class ProjectService(
        private val projectRepository: ProjectRepository,
        private val userRepository: UserRepository
) {
    fun findAll() = projectRepository.findAll()
    fun findById(id: UUID) = projectRepository.findById(id)
    fun save(projectDto: ProjectDto) = projectRepository.save(dtoToProject(projectDto))
    fun deleteById(id: UUID) = projectRepository.deleteById(id)
    fun dtoToProject(projectDto: ProjectDto) = Project(
            id = projectDto.id ?: UUID.randomUUID(),
            name = projectDto.name,
            description = projectDto.description,
            creator=userRepository.findById(projectDto.creatorId!!).get()
    )

    fun addMembers(id: UUID, members: List<UUID>): Project {
        val project = projectRepository.findById(id).get()
        project.members.addAll(userRepository.findAllById(members))
        return projectRepository.save(project)
    }
}