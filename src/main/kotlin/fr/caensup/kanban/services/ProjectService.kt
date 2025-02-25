package fr.caensup.kanban.services

import fr.caensup.kanban.dtos.ProjectDto
import fr.caensup.kanban.entities.Project
import fr.caensup.kanban.repositories.ProjectRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class ProjectService(
    private val projectRepository: ProjectRepository
) {
    fun findAll() = projectRepository.findAll()
    fun findById(id: UUID) = projectRepository.findById(id)
    fun save(project: ProjectDto) = projectRepository.save(dtoToProject(project))
    fun deleteById(id: UUID) = projectRepository.deleteById(id)
    fun dtoToProject(projectDto: ProjectDto) = Project(
        id = projectDto.id ?: UUID.randomUUID(),
        name = projectDto.name ?: "",
        description = projectDto.description ?: ""
    )
}