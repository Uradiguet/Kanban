package fr.caensup.kanban.Controllers

import fr.caensup.kanban.dtos.ProjectDto
import fr.caensup.kanban.entities.Project
import fr.caensup.kanban.services.ProjectService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/projects")
class ProjectController(
    private val projectService: ProjectService
) {
    @GetMapping(path = ["/", ""])
    fun findAll() = projectService.findAll()

    @PostMapping(path = ["/", ""])
    fun save(@RequestBody project: ProjectDto) = projectService.save(project)
}