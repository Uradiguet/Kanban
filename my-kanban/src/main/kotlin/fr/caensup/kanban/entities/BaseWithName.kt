package fr.caensup.kanban.entities

import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.ManyToMany
import jakarta.persistence.ManyToOne
import jakarta.persistence.MappedSuperclass
import java.util.Date
import java.util.UUID

@MappedSuperclass
open class BaseWithName(
    @Id
    open var id: UUID= UUID.randomUUID(),

    @Column(length = 120, nullable = false)
    open var name: String? = null,

    @Column(length = 255)
    open var description: String? = null,

) {

}