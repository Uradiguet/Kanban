package fr.caensup.kanban.services

import fr.caensup.kanban.dtos.BoardDto
import fr.caensup.kanban.entities.Board
import fr.caensup.kanban.repositories.BoardRepository
import fr.caensup.kanban.repositories.ProjectRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class BoardService(
    private val boardRepository: BoardRepository,
    private val projectRepository: ProjectRepository
) {

    fun findAll() = boardRepository.findAll()

    fun findById(id: UUID) = boardRepository.findById(id).orElse(null)

    fun existsById(id: UUID) = boardRepository.existsById(id)

    fun save(boardDto: BoardDto): Board {
        val board = if (boardDto.id != null) {
            // Mise à jour
            boardRepository.findById(boardDto.id!!).orElse(Board()).apply {
                name = boardDto.title // Frontend utilise "title"
                description = boardDto.description
                color = boardDto.color
                position = boardDto.position
                updatedAt = LocalDateTime.now()
                
                // Mise à jour du projet si fourni
                if (boardDto.projectId != null && boardDto.projectId != project?.id) {
                    project = projectRepository.findById(boardDto.projectId!!).orElse(null)
                }
            }
        } else {
            // Création
            Board(
                name = boardDto.title,
                description = boardDto.description,
                color = boardDto.color,
                position = boardDto.position,
                project = boardDto.projectId?.let { projectRepository.findById(it).orElse(null) }
            )
        }
        
        return boardRepository.save(board)
    }

    fun deleteById(id: UUID) = boardRepository.deleteById(id)

    fun getBoardTasks(boardId: UUID): List<*> {
        return findById(boardId)?.tasks ?: emptyList<Any>()
    }

    private fun dtoToBoard(dto: BoardDto): Board {
        return Board(
            id = dto.id ?: UUID.randomUUID(),
            name = dto.title, // Frontend utilise "title"
            description = dto.description,
            color = dto.color,
            position = dto.position,
            project = dto.projectId?.let { projectRepository.findById(it).orElse(null) }
        )
    }
}
