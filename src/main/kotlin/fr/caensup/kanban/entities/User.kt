package fr.caensup.kanban.entities

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.ManyToMany
import jakarta.persistence.OneToMany
import java.util.*

@Entity

open class User(
    @Id
    open var id: UUID = UUID.randomUUID(),

    @Column(length = 60, nullable = false, unique = true)
    open var login: String ?= null,

    @Column(length = 255, nullable = false)
    open var password: String ?= null,

    @Column(length = 120, nullable = false, unique = true)
    open var email: String ?= null,

    @Column(length = 60)
    open var firstname: String ?= null,

    @Column(length = 60)
    open var lastname: String ?= null
) {
    @OneToMany(mappedBy = "creator")
    open var myProjects: MutableList<Project> = mutableListOf()

    @ManyToMany(mappedBy = "members")
    open var projects: MutableList<Project> = mutableListOf()
}