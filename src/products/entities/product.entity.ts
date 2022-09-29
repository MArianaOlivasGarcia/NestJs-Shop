import { User } from "../../auth/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";



@Entity({ name: 'products' })
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column('text', {
        unique: true
    })
    title: string;


    @Column('float', {
        default: 0
    })
    price: number;


    @Column('text', {
        nullable: true
    })
    description: string;


    @Column('text', {
        unique: true
    })
    slug: string;


    @Column('int', {
        default: 0
    })
    stock: number;
    


    // @Column('text', {
    //     array: true
    // })
    // sizes: string[];


    // @Column('text')
    // gender: string;


    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    // Un producto tiene muchas imagenes
    @OneToMany(
        () => ProductImage, // regresara un ProductImage
        ( productImage ) => productImage.product,
        {
            cascade: true,
            eager: true // Cada que usemos algún metodo find* se haran las relaciones y obtendremos la data automaticamente
        }
    )
    images?: ProductImage[]




    @ManyToOne(
        () => User,
        ( user ) => user.products,
        { onDelete: 'CASCADE' }
    )
    user: User




    @BeforeInsert()
    chackSlugInsert() {

        if ( !this.slug ) {
            this.slug = this.title
        }

        this.slug = this.slug.toLowerCase()
                            .replaceAll(' ', '_')
                            .replaceAll("'", '')
                            .replaceAll('-', '_')
    }



    @BeforeUpdate()
    chackSlugUpdate() {

        this.slug = this.slug.toLowerCase()
                            .replaceAll(' ', '_')
                            .replaceAll("'", '')
                            .replaceAll('-', '_')

    }

}
