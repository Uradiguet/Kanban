package fr.caensup.kanban.repositories

import fr.caensup.kanban.entities.Task
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface TaskRepository : JpaRepository<Task, UUID>
