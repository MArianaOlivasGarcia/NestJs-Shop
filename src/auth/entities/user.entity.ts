import { Product } from "../../products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'users' })
export class User {


    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column('text', {
        unique: true
    })
    email: string;

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


    @OneToMany(
        () => Product, // regresara un ProductImage
        ( product ) => product.user,
        {
            cascade: true,
            eager: true // Cada que usemos algún metodo find* se haran las relaciones y obtendremos la data automaticamente
        }
    )
    products?: Product[]




    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.trim().toLowerCase();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.email = this.email.trim().toLowerCase();
    }

}
