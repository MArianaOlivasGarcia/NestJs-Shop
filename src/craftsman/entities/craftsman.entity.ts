import { User } from "../../auth/entities/user.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'craftsmen' })
export class Craftsman {


    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column('text')
    name: string;

    @Column('text')
    lastName: string;

    @Column('float', {
        array: true
    })
    geoLocalization: number[];

    @Column('date')
    admissionDate: string

    @Column('text')
    gender: string; // F ó M

    @ManyToOne(
        () => User, // regresara un User
        {
            cascade: true,
            eager: true // Cada que usemos algún metodo find* se haran las relaciones y obtendremos la data automaticamente
        }
    )
    leader: User


}