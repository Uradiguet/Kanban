// src/main/kotlin/fr/caensup/kanban/controllers/BoardController.kt
package fr.caensup.kanban.controllers

import fr.caensup.kanban.entities.Board
import fr.caensup.kanban.services.BoardService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@CrossOrigin(origins = ["http://localhost:3000", "http://127.0.0.1:3000"])
@RequestMapping("/boards")
class BoardController(private val boardService: BoardService) {

    @GetMapping
    fun getAllBoards(): ResponseEntity<*> {
        println("🔍 GET /boards - Début")

        return try {
            val boards = boardService.findAll()
            println("✅ Service réussi, ${boards.size} boards trouvés")

            // Transformation pour que le frontend reçoive "title" au lieu de "name"
            val boardsWithTitle = boards.map { board ->
                mapOf(
                    "id" to board.id,
                    "title" to board.name,  // Conversion name -> title pour le frontend
                    "name" to board.name,   // Garde aussi name pour compatibilité
                    "description" to board.description,
                    "color" to board.color,
                    "position" to board.position,
                    "createdAt" to board.createdAt,
                    "updatedAt" to board.updatedAt
                )
            }

            ResponseEntity.ok(boardsWithTitle)
        } catch (e: Exception) {
            println("❌ ERREUR dans getAllBoards: ${e.message}")
            e.printStackTrace()
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to e.message))
        }
    }

    @PostMapping
    fun createBoard(@RequestBody request: Map<String, Any>): ResponseEntity<*> {
        println("🔍 POST /boards avec: $request")

        return try {
            val title = request["title"] as? String ?: "Nouvelle colonne"
            val description = request["description"] as? String
            val color = request["color"] as? String ?: "bg-gray-100 border-gray-300"

            println("📝 Création board: title='$title', color='$color'")

            val board = Board(
                name = title,  // Frontend envoie "title", on l'utilise pour "name"
                description = description,
                color = color,
                position = 0
            )

            val savedBoard = boardService.saveBoard(board)
            println("✅ Board créé: ${savedBoard.id} avec nom='${savedBoard.name}'")

            // Retourner avec "title" pour le frontend
            val response = mapOf(
                "id" to savedBoard.id,
                "title" to savedBoard.name,  // Conversion name -> title
                "name" to savedBoard.name,
                "description" to savedBoard.description,
                "color" to savedBoard.color,
                "position" to savedBoard.position,
                "createdAt" to savedBoard.createdAt,
                "updatedAt" to savedBoard.updatedAt
            )

            ResponseEntity.status(HttpStatus.CREATED).body(response)

        } catch (e: Exception) {
            println("❌ ERREUR dans createBoard: ${e.message}")
            e.printStackTrace()
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to e.message))
        }
    }

    @DeleteMapping("/{id}")
    fun deleteBoard(@PathVariable id: UUID): ResponseEntity<*> {
        println("🔍 DELETE /boards/$id")

        return try {
            if (boardService.existsById(id)) {
                boardService.deleteById(id)
                println("✅ Board supprimé: $id")
                ResponseEntity.noContent().build<Any>()
            } else {
                println("❌ Board non trouvé: $id")
                ResponseEntity.notFound().build<Any>()
            }
        } catch (e: Exception) {
            println("❌ ERREUR dans deleteBoard: ${e.message}")
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to e.message))
        }
    }

    @GetMapping("/test")
    fun test(): ResponseEntity<Map<String, String>> {
        println("🔍 GET /boards/test")
        return ResponseEntity.ok(mapOf("status" to "OK", "message" to "Controller fonctionne"))
    }
}