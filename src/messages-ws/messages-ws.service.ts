import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

interface ConnectedClients {
    [id: string]: {
        socket: Socket,
        user: User
    } 
}


@Injectable()
export class MessagesWsService {

    constructor( @InjectRepository( User ) private readonly userRepository: Repository<User>){}

    private connectedClients: ConnectedClients = {}


   async registerClient( client: Socket, userId: string ) {

        const user = await this.userRepository.findOneBy({id: userId});

        if ( !user ) throw new Error(`User not found.`);
        if ( !user.isActive ) throw new Error(`User not active.`);

        this.checkUserConnection( user.id );

        this.connectedClients[ client.id ] = {
            socket: client,
            user
        };

    }


    removeClient( clientId: string ) {
        delete this.connectedClients[ clientId ];
    }

    getConnectedClients(): string[] {
        return Object.keys(this.connectedClients);
    }


    getUserFullName = ( socketId: string ) => {
        return this.connectedClients[ socketId ].user.fullName;
    }



    private checkUserConnection( userId: string ) {

        for (const clientId of Object.keys( this.connectedClients ) ) {
            const connectedClient = this.connectedClients[ clientId ];

            if ( connectedClient.user.id === userId ) {
                connectedClient.socket.disconnect();
                break;
            }
        }

    }


}
