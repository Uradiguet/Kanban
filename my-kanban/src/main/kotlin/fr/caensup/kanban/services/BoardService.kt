// src/main/kotlin/fr/caensup/kanban/services/BoardService.kt
package fr.caensup.kanban.services

import fr.caensup.kanban.entities.Board
import fr.caensup.kanban.repositories.BoardRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class BoardService(private val boardRepository: BoardRepository) {

    fun findAll(): List<Board> {
        return try {
            val boards = boardRepository.findAll()
            println("✅ Service: Trouvé ${boards.size} boards")
            boards
        } catch (e: Exception) {
            println("❌ Erreur dans findAll: ${e.message}")
            e.printStackTrace()
            emptyList()
        }
    }

    fun findById(id: UUID): Board? {
        return try {
            boardRepository.findById(id).orElse(null)
        } catch (e: Exception) {
            println("❌ Erreur dans findById: ${e.message}")
            null
        }
    }

    fun existsById(id: UUID): Boolean {
        return try {
            boardRepository.existsById(id)
        } catch (e: Exception) {
            println("❌ Erreur dans existsById: ${e.message}")
            false
        }
    }

    fun saveBoard(board: Board): Board {
        return try {
            val saved = boardRepository.save(board)
            println("✅ Board sauvé: ${saved.id}")
            saved
        } catch (e: Exception) {
            println("❌ Erreur dans save: ${e.message}")
            e.printStackTrace()
            throw e
        }
    }

    fun deleteById(id: UUID) {
        try {
            boardRepository.deleteById(id)
            println("✅ Board supprimé: $id")
        } catch (e: Exception) {
            println("❌ Erreur dans delete: ${e.message}")
            throw e
        }
    }
}