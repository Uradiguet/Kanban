package fr.caensup.kanban.repositories

import fr.caensup.kanban.entities.Project
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*


interface ProjectRepository:JpaRepository<Project, UUID> {


}