package fr.caensup.kanban.repositories

import fr.caensup.kanban.entities.Board
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface BoardRepository: JpaRepository<Board, UUID> {
}