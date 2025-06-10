"use client";

import User from "@/models/User";
import {Badge, Button, List, Modal} from "antd";
import {useState} from "react";
import UserFormComponent from "@/components/users/UserFormComponent";
import HttpService from "@/services/HttpService";
import API_URLS from "@/constants/ApiUrls";

export default function UsersComponent({...props}:{users:User[]}){

    const [users, setUsers] = useState<User[]>(props.users);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editedUser, setEditedUser] = useState<User|null>(null);

    const addUser = (user: User) => {
        if (!user.id) {
            delete user.id;
        }
        HttpService.post(API_URLS.users, user).then((response) => {
            if (response.status === 201 && Array.isArray(response.data)) {
                setUsers([...users, ...response.data]);
            }
        });
        setShowModal(false);
    };

    const updateUser = (user: User) => {
        HttpService.put(`${API_URLS.users}/${user.id}`, user).then((response) => {
            if (response.status === 200 && Array.isArray(response.data)) {
                setUsers(users.map((u) => (u.id === user.id ? response.data : u)));
            }
        });
        setShowModal(false);
    };

    return (
        <>
            <Button type={"default"}
                    onClick={()=>{
                        setEditedUser(new User());
                        setShowModal(true);
                    }}>
                Ajouter un utilisateur
            </Button>
            <Modal open={showModal} title={"Ajouter un utilisateur"}
                   onCancel={()=>setShowModal(false)}
                   onOk={()=>{
                          if(editedUser.id) {
                              updateUser(editedUser);
                          }else {
                              addUser(editedUser);
                          }
                   }}>
                <UserFormComponent user={editedUser} setUser={setEditedUser}/>
            </Modal>
            <List dataSource={users}
                  header={<h2 className={"text-xm font-bold"}>
                      Utilisateurs <Badge color={"cyan"} count={props.users.length}/>
                        </h2>
                    }
                  renderItem={(user:User)=>
                      <List.Item key={user.id} actions={[
                          <Button color={"default"}
                                  shape={"circle"}
                                  icon={<i className={"fas fa-edit"}/>}
                                  onClick={()=>{
                                      setEditedUser(user);
                                      setShowModal(true);
                                  }}/>,
                          <Button color={"danger"}
                                  shape={"circle"}
                                  icon={<i className={"fas fa-trash"}/>}
                                  onClick={()=>{
                                      HttpService.delete(API_URLS.users+"/"+user.id).then((response)=>{
                                          if(response.status===204){
                                              setUsers(users.filter((u)=>u.id!==user.id));
                                          }
                                      });
                                  }
                                  }/>
                      ]}>
                          <div className={"flex items-center gap-4 w-full"}>
                            <div className={"flex-1"}>
                              {user.firstname} {user.lastname} ({user.username}) - {user.email}
                            </div>
                          </div>
                      </List.Item>}
            >

            </List>
        </>
    );
}