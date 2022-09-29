import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'shopping_address' })
export class ShoppingAdress {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    firstName: string;

    @Column('text')
    lastName: string;

    @Column('text')
    address: string;
    
    @Column('text', {
        nullable: true
    })
    address2: string
    
    @Column('text')
    zip: string;    
    
    @Column('text')
    city: string;     

    @Column('text')
    country: string;  

    @Column('text')
    phone: string; 

}