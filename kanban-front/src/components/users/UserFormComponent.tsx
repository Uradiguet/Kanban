import User from "@/models/User";
import {Form, Input} from "antd";


export default function UserFormComponent({...props}:{user:User, setUser:(u:User)=>void}){
    return (
        <>
            <h2 className={"text-lg font-bold"}>Utilisateur</h2>
            <Form>
                <div className={"grid grid-cols-2 gap-4"}>
                    <div>
                        <label htmlFor="username">Nom d'utilisateur</label>
                        <Input type="text"
                               id={"username"}
                               value={props.user.username}
                               onChange={(e)=>{
                                   props.setUser({...props.user, username:e.target.value});
                                 }}
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <Input type="email"
                               id={"email"}
                               value={props.user.email}
                                 onChange={(e)=>{
                                      props.setUser({...props.user, email:e.target.value});
                                    }}
                        />
                    </div>
                    <div>
                        <label htmlFor="firstname">Prénom</label>
                        <Input type="text"
                               id={"firstname"}
                               value={props.user.firstname}
                               onChange={(e)=>{
                                      props.setUser({...props.user, firstname:e.target.value});
                                      }
                                    }
                               />
                    </div>
                    <div>
                        <label htmlFor="lastname">Nom</label>
                        <Input type="text"
                               id={"lastname"}
                               value={props.user.lastname}
                                 onChange={(e)=>{
                                          props.setUser({...props.user, lastname:e.target.value});
                                          }
                                        }
                        />
                    </div>
                </div>
            </Form>
        </>
    );
}