package fr.caensup.kanban.controllers

import fr.caensup.kanban.dtos.BoardDto
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
    fun getAllBoards() = ResponseEntity.ok(boardService.findAll())

    @GetMapping("/{id}")
    fun getBoardById(@PathVariable id: UUID) = 
        boardService.findById(id)?.let { ResponseEntity.ok(it) } 
            ?: ResponseEntity.notFound().build()

    @PostMapping
    fun createBoard(@RequestBody boardDto: BoardDto) = 
        ResponseEntity(boardService.save(boardDto), HttpStatus.CREATED)

    @PutMapping("/{id}")
    fun updateBoard(@PathVariable id: UUID, @RequestBody boardDto: BoardDto): ResponseEntity<Board> {
        return if (boardService.existsById(id)) {
            boardDto.id = id
            ResponseEntity.ok(boardService.save(boardDto))
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteBoard(@PathVariable id: UUID): ResponseEntity<Void> {
        return if (boardService.existsById(id)) {
            boardService.deleteById(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/{id}/tasks")
    fun getBoardTasks(@PathVariable id: UUID) = 
        ResponseEntity.ok(boardService.getBoardTasks(id))
}
