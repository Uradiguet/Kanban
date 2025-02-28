package fr.caensup.kanban.entities

import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.ManyToMany
import jakarta.persistence.ManyToOne
import java.util.Date
import java.util.UUID

@Entity
open class Project(

    id: UUID = UUID.randomUUID(),
    name: String? = null,
    description: String? = null,

    @ManyToOne(optional = false)
    open var creator: User

):baseWithName(

    id = id,
    name = name,
    description = description

) {

    @Column(nullable = false)
    open var createAt:Date = Date()

    @ManyToMany
    open var members: MutableList<User> = mutableListOf()

}