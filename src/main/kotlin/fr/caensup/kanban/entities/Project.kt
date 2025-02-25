package fr.caensup.kanban.entities

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import java.util.Date
import java.util.UUID

@Entity
open class Project(
    @Id
    open var id: UUID = UUID.randomUUID(),

    @Column(length = 120, nullable = false)
    open var name: String ?= null,

    @Column(length = 255)
    open var description: String ?= null
) {
    @Column(nullable = false)
    open var createAt:Date = Date()

}