import { Product } from "../../products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'users' })
export class User {


    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column('text', {
        unique: true
    })
    userName: string;

    @Column('text', {
        select: false
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool', {
        default: true
    })
    isActive?: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];


    @Column('bool',{
        default: false
    })
    isOnline?: boolean


    @OneToMany(
        () => Product, 
        ( product ) => product.user,
        {
            cascade: true,
            eager: true 
        }
    )
    products?: Product[]




    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.userName = this.userName.trim().toLowerCase();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.userName = this.userName.trim().toLowerCase();
    }

}
