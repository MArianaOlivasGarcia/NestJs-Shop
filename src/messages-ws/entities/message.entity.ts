import { User } from "../../auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'messages' })
export class Message {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column('text')
    message: string;

    @ManyToOne(
        () => User, // regresará un User
        {
            cascade: true,
            eager: true // Cada que usemos algún metodo find* se haran las relaciones y obtendremos la data automaticamente
        }
    )
    user_from: User;

 
    @CreateDateColumn()
    created_at: Date;
        
    @UpdateDateColumn()
    updated_at: Date;

   
}
