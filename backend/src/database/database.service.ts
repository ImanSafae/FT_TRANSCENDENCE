import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assurez-vous d'importer correctement le service Prisma
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable()
export class DatabaseService {
  constructor(private readonly prismaService: PrismaService) {}

  
  // Table FUN
  async createUser(username: string, pp: string, fullName: string, id42: number): Promise<any> {
    try {
      const user = await this.prismaService.prisma.userData.create({
        data: {
          id42: id42,
          pp: pp,
          username: username,
          fullName: fullName,
          FA2Key: null,
          pseudo: username,
        },
      });
      return user;
    } catch (error) {
      throw new Error("Erreur : impossible de crée les données utilisateur depuis createUser");
    }
  }

  async createRoom(roomName: string, ownerName: string): Promise<any> {
    try {
      const room = await this.prismaService.prisma.room.create({
        data: {
          name: roomName,
          owner: ownerName,
          userList: [ownerName],
          adminList: [ownerName],
          password: null,
        },
      });
      return room;
    } catch (error) {
      throw new Error("Erreur : impossible de crée une room depuis createRoom");
    }
  }
  
  async getUserInformation(username: string): Promise<any> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      return user;
    } catch (error) {
      console.log("DB error:", error);
      throw new Error("Erreur : impossible d'obtenir les informations de l'utilisteur depuis getUserInformation");
    }
  }

  async getRoomInformation(roomName: string): Promise<any> {
    try {
      const room = await this.prismaService.prisma.room.findUnique({
        where: {name: roomName},
        include: {messages: true}
      });
      if (!room)
        return null;
      return room;
    } catch (error) {
      throw new Error("Erreur : impossible d'obtenir les informations de la room depuis getRoomInformation");
    }
  }

  //USER FUN-------------------------------------------------------------------------
  //USER FUN-------------------------------------------------------------------------
  //USER FUN-------------------------------------------------------------------------
  //USER FUN-------------------------------------------------------------------------


  // Get Fun------------------------------------------------------------------------------------
  

  async getUserById42(id42: number): Promise<string | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {id42},
        select: {username: true},
      });
      if (!user)
        return null;
      return user.username;
    } catch (error) {
      throw new Error("Erreur : impossible d'obtenir l'username depuis getUserById42");
    }
  }

  async getUserByPseudo(pseudo: string): Promise<string | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {pseudo},
        select: {username: true},
      });
      if (!user)
        return null;
      return user.username;
    } catch (error) {
      throw new Error("Erreur : impossible d'obtenir l'username depuis getUserByPseudo");
    }
  }

  async getId42ByUser(username: string): Promise<number | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
        select: {id42: true},
      });
      if (!user)
        return null;
      return user.id42;
    } catch (error) {
      throw new Error("Erreur : impossible d'obtenir l'id42 depuis getId42ByUser");
    }
  }

  async getId2ByUser(username: string): Promise<number | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
        select: {id: true},
      });
      if (!user)
        return null;
      return user.id;
    } catch (error) {
      throw new Error("Erreur : impossible d'obtenir l'username depuis getIdByUser");
    }
  }

  async getPPByUser(username: string): Promise<string | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
        select: {pp: true},
      });
      if (!user)
        return null;
      return user.pp;
    } catch (error) {
      throw new Error("Erreur : impossible d'obtenir la photo de profil depuis getPPByUser");
    }
  }

  async getFA2ByUser(username: string): Promise<boolean | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
        select: {FA2: true},
      });
      if (!user)
        return null;
      return user.FA2;
    } catch (error) {
      throw new Error("Erreur : impossible de savoir si la FA2 est active depuis getFA2ByUser");
    }
  }

  async getFA2KeyByUser(username: string): Promise<string | null> {
    try {
      console.log("attempting to get secret of", username);
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
        select: {FA2Key: true},
      });
      if (!user)
      {
        return null;
      }
      return user.FA2Key;
    } catch (error) {
      throw new Error("Erreur : impossible d'obtenir la clé FA2 depuis getFA2ByUser");
    }
  }

  async getFullNameByUser(username: string): Promise<string | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
        select: {fullName: true},
      });
      if (!user)
        return null;
      return user.fullName;
    } catch (error) {
      throw new Error("Erreur : impossible d'obtenir le FullName depuis getFullNameByUser");
    }
  }

  async getPseudo(username: string): Promise<string | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
        select: {pseudo: true},
      });
      if (!user)
        return null;
      return user.pseudo;
    } catch (error) {
      throw new Error("Erreur : depuis getPseudo");
    }
  }

  async getStatusByUser(username: string): Promise<string | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
        select: {status: true},
      });
      if (!user)
        return null;
      return user.status;
    } catch (error) {
      throw new Error("Erreur : impossible d'obtenir le status depuis getStatusByUser");
    }
  }
  
  async getFriendListByUser(username: string): Promise<string[] | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
        select: {friendList: true},
      });
      if (!user)
        return null;
      return user.friendList;
    } catch (error) {
      throw new Error("Erreur : impossible d'obtenir la liste d'amis depuis getFriendListByUser");
    }
  }

  async getBlockedUser(username: string): Promise<string[] | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
        select: {blockedUser: true},
      });
      if (!user)
        return null;
      return user.blockedUser;
    } catch (error) {
      throw new Error("Erreur : getBlockedUserByUser");
    }
  }

  async getFriendRequest(username: string): Promise<string[] | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
        select: {friendRequest: true},
      });
      if (!user)
        return null;
      return user.friendRequest;
    } catch (error) {
      throw new Error("Erreur : getBlockedUserByUser");
    }
  }

  async getRoomOwned(username: string): Promise<string[] | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
        select: {roomOwned: true},
      });
      if (!user)
        return null;
      return user.roomOwned;
    } catch (error) {
      throw new Error("Erreur : getRoomOwnedByUser");
    }
  }

  async getRoomJoined(username: string): Promise<string[] | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
        select: {roomJoined: true},
      });
      if (!user)
        return null;
      return user.roomJoined;
    } catch (error) {
      throw new Error("Erreur : getRoomJoinedByUser");
    }
  }

  //------------------------------------------------------------------------------------

  // Update FUN------------------------------------------------------------------------------------

  async updateUsername(username: string, newName: string): Promise<string | null | boolean> {
    try
    {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username: username},
      });
      if (!user)
        return null;
      else
      {
        const user = await this.prismaService.prisma.userData.findUnique({
          where: {username: newName},
        });
        if (!user)
        {
          await this.prismaService.prisma.userData.update({
            where: {username},
            data: {username: newName},
          });
          const userAfterUpdate = await this.prismaService.prisma.userData.findUnique({
            where: {username: newName},
          });
          return userAfterUpdate.username;
        }
        else
          return false;
      }
    } catch (error) {
      throw new Error("Erreur : impossible de modifier Username depuis updateUsername");
    }
  }

  async updatePseudo(login: string, newPseudo: string): Promise<string | null | boolean> {
    try
    {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username: login},
      });
      if (!user)
        return null;
      else
      {
        const user = await this.prismaService.prisma.userData.findUnique({
          where: {pseudo: newPseudo},
        });
        if (!user)
        {
          await this.prismaService.prisma.userData.update({
            where: {username: login},
            data: {pseudo: newPseudo},
          });
          const userAfterUpdate = await this.prismaService.prisma.userData.findUnique({
            where: {pseudo: newPseudo},
          });
          return userAfterUpdate.pseudo;
        }
        else
          return false;
      }
    } catch (error) {
      throw new Error("Erreur : impossible de modifier Username depuis updateUsername");
    }
  }

  async updateFullName(username: string, newName: string): Promise<string | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        await this.prismaService.prisma.userData.update({
          where: {username},
          data: {fullName: newName},
        });
        const userAfterUpdate = await this.prismaService.prisma.userData.findUnique({
          where: {username},
        });
        return userAfterUpdate.fullName;
      }
    } catch (error) {
      throw new Error("Erreur : impossible de modifier FullName depuis updateFullName");
    }
  }

  async updatePP(username: string, pp: string): Promise<string | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        await this.prismaService.prisma.userData.update({
          where: {username},
          data: {pp: pp},
        });
        const userAfterUpdate = await this.prismaService.prisma.userData.findUnique({
          where: {username},
        });
        return userAfterUpdate.pp;
      }
    } catch (error) {
      throw new Error("Erreur : impossible de modifier la photo de profil depuis updatePP");
    }
  }

  async updateFA2Key(username: string, newFA2Key: string | null ): Promise<string | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        await this.prismaService.prisma.userData.update({
          where: {username},
          data: {FA2Key: newFA2Key},
        });
        const userAfterUpdate = await this.prismaService.prisma.userData.findUnique({
          where: {username},
        });
        return userAfterUpdate.FA2Key;
      }
    } catch (error) {
      throw new Error("Erreur : impossible de modifier la valeur de la clé FA2 depuis update2FAKey");
    }
  }

  async updateStatus(username: string, newStatus: string): Promise<string | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        await this.prismaService.prisma.userData.update({
          where: {username},
          data: {status: newStatus},
        });
        const userAfterUpdate = await this.prismaService.prisma.userData.findUnique({
          where: {username},
        });
        return userAfterUpdate.status;
      }
    } catch (error) {
      console.log("Error:", error);
      throw new Error("Erreur : impossible de modifier status depuis updateStatus");
    }
  }

  async switchFA2(username: string): Promise<boolean | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        await this.prismaService.prisma.userData.update({
          where: {username},
          data: {
            FA2Key: null,
            FA2: !user.FA2,
          },
        });
        const userAfterUpdate = await this.prismaService.prisma.userData.findUnique({
          where: {username},
        });
        return userAfterUpdate.FA2;
      }
    } catch (error) {
      throw new Error("Erreur : impossible de modifier FA2 depuis switchFA2");
    }
  }

  //------------------------------------------------------------------------------------------------------------

  // Add Fun ----------------------------------------------------------------------------------------------
  
  async addBlockedUser(username: string, newBlockedUser: string): Promise<string[] | null | boolean> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        const blockedUser = user.blockedUser;
        const idx = blockedUser.indexOf(newBlockedUser);
        if (idx == -1) {
          await this.prismaService.prisma.userData.update({
            where: {username},
            data: {
              blockedUser: {
                push: newBlockedUser,
              },
            },
          });
          const userAfterUpdate = await this.prismaService.prisma.userData.findUnique({
            where: {username},
          });
          return userAfterUpdate.blockedUser;
        }
        else
          return false;
      }
    } catch (error) {
      throw new Error("Erreur : impossible de bloquer un nouvelle utilisateiur depuis addBlockedUser");
    }
  }

  async addFriendRequest(username: string, requestUsername: string): Promise<string[] | null | boolean> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        const friendRequest = user.friendRequest;
        const idx = friendRequest.indexOf(requestUsername);
        if (idx == -1) {
          await this.prismaService.prisma.userData.update({
            where: {username},
            data: {
              friendRequest: {
                push: requestUsername,
              },
            },
          });
          const userAfterUpdate = await this.prismaService.prisma.userData.findUnique({
            where: {username},
          });
          return userAfterUpdate.friendRequest;
        }
        else
          return false;
      }
    } catch (error) {
      throw new Error("Erreur : depuis addFriendRequest");
    }
  }

  async addFriend(username: string, newFriend: string): Promise<string[] | null | boolean> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        const friendList = user.friendList;
        const idx = friendList.indexOf(newFriend);
        if (idx == -1) {
          await this.prismaService.prisma.userData.update({
            where: {username},
            data: {
              friendList: {
                push: newFriend,
              },
            },
          });
          const userAfterUpdate = await this.prismaService.prisma.userData.findUnique({
            where: {username},
          });
          return userAfterUpdate.friendList;
        }
        else
          return false;
      }
    } catch (error) {
      throw new Error("Erreur : impossible d'ajouter un ami depuis addFriend");
    }
  }

  async addRoomToOwnedRoom(username: string, newOwnedRoom: string): Promise<string[] | null | boolean> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        const ownedRoom = user.roomOwned;
        const idx = ownedRoom.indexOf(newOwnedRoom);
        if (idx == -1) {
          await this.prismaService.prisma.userData.update({
            where: {username},
            data: {
              roomOwned: {
                push: newOwnedRoom,
              },
            },
          });
          const userAfterUpdate = await this.prismaService.prisma.userData.findUnique({
            where: {username},
          });
          return userAfterUpdate.friendList;
        }
        else
          return false;
      }
    } catch (error) {
      throw new Error("Erreur : impossible d'ajouter une room dans roomOwned");
    }
  }

  async addRoomToJoinedRoom(username: string, newJoinedRoom: string): Promise<string[] | null | boolean> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        const joinedRoom = user.roomJoined;
        const idx = joinedRoom.indexOf(newJoinedRoom);
        if (idx == -1) {
          await this.prismaService.prisma.userData.update({
            where: {username},
            data: {
              roomJoined: {
                push: newJoinedRoom,
              },
            },
          });
          const userAfterUpdate = await this.prismaService.prisma.userData.findUnique({
            where: {username},
          });
          return userAfterUpdate.friendList;
        }
        else
          return false;
      }
    } catch (error) {
      throw new Error("Erreur : impossible d'ajouter une room dans roomjoined");
    }
  }

  //------------------------------------------------------------------------------------------------------------
  
  //Del Fun ------------------------------------------------------------------------------------------------------
  
  async delBlockedUser(username: string, userToRemove: string): Promise<string[] | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        const blockedList = user.blockedUser;
        const idx = blockedList.indexOf(userToRemove);
        if (idx !== -1) {
          blockedList.splice(idx, 1);
          await this.prismaService.prisma.userData.update({
            where: {username},
            data: {
              blockedUser: blockedList,
            }
          });
        }
        const userAfterUpdate = await this.prismaService.prisma.userData.findUnique({
          where: {username},
        });
        return userAfterUpdate.blockedUser;
      }
    } catch (error) {
      throw new Error("Erreur : impossible de debloquer un utilisateur depuis delBlockedUser");
    }
  }

  async delFriend(username: string, userToRemove: string): Promise<string[] | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        const friends = user.friendList;
        const idx = friends.indexOf(userToRemove);
        if (idx !== -1) {
          friends.splice(idx, 1);
          await this.prismaService.prisma.userData.update({
            where: {username},
            data: {
              friendList: friends,
            }
          });
        }
        const userAfterUpdate = await this.prismaService.prisma.userData.findUnique({
          where: {username},
        });
        return userAfterUpdate.friendList;
      }
    } catch (error) {
      throw new Error("Erreur : impossible de supprimer un utilisateur de la liste d'amis depuis delFriend");
    }
  }

  async delFriendRequest(username: string, requestToRemove: string): Promise<string[] | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        const friendsR = user.friendRequest;
        const idx = friendsR.indexOf(requestToRemove);
        if (idx !== -1) {
          friendsR.splice(idx, 1);
          await this.prismaService.prisma.userData.update({
            where: {username},
            data: {
              friendRequest: friendsR,
            }
          });
        }
        const userAfterUpdate = await this.prismaService.prisma.userData.findUnique({
          where: {username},
        });
        return userAfterUpdate.friendRequest;
      }
    } catch (error) {
      throw new Error("Erreur : depuis delFriendRequest");
    }
  }

  async delRoomOwned(username: string, roomToRemove: string): Promise<string[] | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        const roomOwned = user.roomOwned;
        const idx = roomOwned.indexOf(roomToRemove);
        if (idx !== -1) {
          roomOwned.splice(idx, 1);
          await this.prismaService.prisma.userData.update({
            where: {username},
            data: {
              roomOwned: roomOwned,
            }
          });
        }
        const userAfterUpdate = await this.prismaService.prisma.userData.findUnique({
          where: {username},
        });
        return userAfterUpdate.roomOwned;
      }
    } catch (error) {
      throw new Error("Erreur : impossible de supprimer la room de roomOwned");
    }
  }

  async delRoomJoined(username: string, roomToRemove: string): Promise<string[] | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        const roomJoined = user.roomJoined;
        const idx = roomJoined .indexOf(roomToRemove);
        if (idx !== -1) {
          roomJoined.splice(idx, 1);
          await this.prismaService.prisma.userData.update({
            where: {username},
            data: {
              roomJoined: roomJoined,
            }
          });
        }
        const userAfterUpdate = await this.prismaService.prisma.userData.findUnique({
          where: {username},
        });
        return userAfterUpdate.roomJoined;
      }
    } catch (error) {
      throw new Error("Erreur : impossible de supprimer la room de roomJoined");
    }
  }


  //------------------------------------------------------------------------------------------------------------
  //Find user inside Array -------------------------------------------------------------------------------------------------
  
  async isBlocked(username: string, userToFind: string): Promise<boolean | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        const blockedList = user.blockedUser;
        const idx = blockedList.indexOf(userToFind);
        if (idx !== -1)
          return true;
        else 
          return false;
      }
    } catch (error) {
      throw new Error("Erreur : depuis isBlocked");
    }
  }

  async isFriend(username: string, userToFind: string): Promise<boolean | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        const friends = user.friendList;
        const idx = friends.indexOf(userToFind);
        if (idx !== -1)
          return true;
        else
          return false;
      }
    } catch (error) {
      throw new Error("Erreur : depuis isFriend");
    }
  }

  async isOwnedRoom(username: string, roomToFind: string): Promise<boolean | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        const roomOwned = user.roomOwned;
        const idx = roomOwned.indexOf(roomToFind);
        if (idx !== -1)
          return true;
        else
          return false;
      }
    } catch (error) {
      throw new Error("Erreur : depuis isOwnedRoom");
    }
  }

  async isJoinedRoom(username: string, roomToFind: string): Promise<boolean | null> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return null;
      else {
        const roomJoined = user.roomJoined;
        const idx = roomJoined.indexOf(roomToFind);
        if (idx !== -1)
          return true;
        else
          return false;
      }
    } catch (error) {
      throw new Error("Erreur : depuis isFriend");
    }
  }

  async UserExist(username: string): Promise<boolean> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
      });
      if (!user)
        return false;
      return true;
    } catch (error) {
      throw new Error("Erreur : depuis UserExist");
    }
  }
  //------------------------------------------------------------------------------------------------------------

  
  
  //ROOM FUN-------------------------------------------------------------------------
  //ROOM FUN-------------------------------------------------------------------------
  //ROOM FUN-------------------------------------------------------------------------
  //ROOM FUN-------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------------------------
  //ADD Fun--------------------------------------------------------------------------------------------------

  async addUserToRoom(roomName: string, newUser: string): Promise <string[] | null | boolean> {
    try {
      const room = await this.prismaService.prisma.room.findUnique({
        where: {name: roomName},
        });
      if (!room)
        return null;
      else {
        const userList = room.userList;
        const idx = userList.indexOf(newUser);
        if (idx == -1) {
          await this.prismaService.prisma.room.update({
            where: {name: roomName},
            data: {
              userList : {
                push: newUser,
              }
            },
          });
          const roomAfterUpdate = await this.prismaService.prisma.room.findUnique({
            where: {name: roomName},
            });
          return roomAfterUpdate.userList;
        }
        return false
      }
    } catch (error) {
      throw new Error("Erreur : impossible d'ajouter un user dans la userList depuis addUserToRoom")
    }
  }

  async addUserToAdminList(roomName: string, newAdmin: string): Promise <string[] | null | boolean> {
    try {
      const room = await this.prismaService.prisma.room.findUnique({
        where: {name: roomName},
        });
      if (!room)
        return null;
      else {
        const adminList = room.adminList;
        const idx = adminList.indexOf(newAdmin);
        if (idx == -1) {
          await this.prismaService.prisma.room.update({
            where: {name: roomName},
            data: {
              adminList : {
                push: newAdmin,
              }
            },
          });
          const roomAfterUpdate = await this.prismaService.prisma.room.findUnique({
            where: {name: roomName},
            });
          return roomAfterUpdate.adminList;
        }
          return false;
      }
    } catch (error) {
      throw new Error("Erreur : impossible d'ajouter un user dans la userList depuis addUserToAdminList")
    }
  }

  async addUserToBanList(roomName: string, newBanned: string): Promise <string[] | null | boolean> {
    try {
      const room = await this.prismaService.prisma.room.findUnique({
        where: {name: roomName},
        });
      if (!room)
        return null;
      else {
        const banList = room.banList;
        const idx = banList.indexOf(newBanned);
        if (idx == -1) {
          await this.prismaService.prisma.room.update({
            where: {name: roomName},
            data: {
              banList : {
                push: newBanned,
              }
            },
          });
          const roomAfterUpdate = await this.prismaService.prisma.room.findUnique({
            where: {name: roomName},
            });
          return roomAfterUpdate.banList;
        }
        return false;
      }
    } catch (error) {
      throw new Error("Erreur : impossible d'ajouter un user dans la userList depuis addUserToBanList")
    }
  }

  //Del fun---------------------------------------------------------------------------------------------------
  
  async delUserFromUserList(name: string, userToRemove: string): Promise<string[] | null> {
    try {
      const room = await this.prismaService.prisma.room.findUnique({
        where: {name: name},
      });
      if (!room)
        return null;
      else {
        const userList = room.userList;
        const idx = userList.indexOf(userToRemove);
        if (idx !== -1) {
          userList.splice(idx, 1);
          await this.prismaService.prisma.room.update({
            where: {name},
            data: {
              userList: userList,
            }
          });
        }
        const roomAfterUpdate = await this.prismaService.prisma.room.findUnique({
          where: {name},
        });
        return roomAfterUpdate.banList;
      }
    } catch (error) {
      throw new Error("Erreur : impossible de supprimer un utilisateur de la banList depuis delUserFromBanList");
    }
  }

  async delUserFromBanList(name: string, userToRemove: string): Promise<string[] | null> {
    try {
      const room = await this.prismaService.prisma.room.findUnique({
        where: {name: name},
      });
      if (!room)
        return null;
      else {
        const banList = room.banList;
        const idx = banList.indexOf(userToRemove);
        if (idx !== -1) {
          banList.splice(idx, 1);
          await this.prismaService.prisma.room.update({
            where: {name},
            data: {
              banList: banList,
            }
          });
        }
        const roomAfterUpdate = await this.prismaService.prisma.room.findUnique({
          where: {name},
        });
        return roomAfterUpdate.banList;
      }
    } catch (error) {
      throw new Error("Erreur : impossible de supprimer un utilisateur de la banList depuis delUserFromBanList");
    }
  }

  async delUserFromAdminList(name: string, userToRemove: string): Promise<string[] | null> {
    try {
      const room = await this.prismaService.prisma.room.findUnique({
        where: {name: name},
      });
      if (!room)
        return null;
      else {
        const adminList = room.adminList;
        const idx = adminList.indexOf(userToRemove);
        if (idx !== -1) {
          adminList.splice(idx, 1);
          await this.prismaService.prisma.room.update({
            where: {name},
            data: {
              adminList: adminList,
            }
          });
        }
        const roomAfterUpdate = await this.prismaService.prisma.room.findUnique({
          where: {name},
        });
        return roomAfterUpdate.adminList;
      }
    } catch (error) {
      throw new Error("Erreur : impossible de supprimer un utilisateur de la adminList depuis delUserFromAdminList");
    }
  }

  //Is Fun-----------------------------------------------------------------------------------------------------

  async isRoomUser(name: string, userToFind: string): Promise<boolean | null> {
    try {
      const room = await this.prismaService.prisma.room.findUnique({
        where: {name},
      });
      if (!room)
        return null;
      else {
        const userList = room.userList;
        const idx = userList.indexOf(userToFind);
        if (idx !== -1)
          return true;
        else
          return false;
      }
    } catch (error) {
      throw new Error("Erreur : depuis isRoomUser");
    }
  }

  async isRoomAdmin(name: string, userToFind: string): Promise<boolean | null> {
    try {
      const room = await this.prismaService.prisma.room.findUnique({
        where: {name},
      });
      if (!room)
        return null;
      else {
        const adminList = room.adminList;
        const idx = adminList.indexOf(userToFind);
        if (idx !== -1)
          return true;
        else
          return false;
      }
    } catch (error) {
      throw new Error("Erreur : depuis isRoomAdmin");
    }
  }

  async isBanFromRoom(name: string, userToFind: string): Promise<boolean | null> {
    try {
      const room = await this.prismaService.prisma.room.findUnique({
        where: {name},
      });
      if (!room)
        return null;
      else {
        const banList = room.banList;
        const idx = banList.indexOf(userToFind);
        if (idx !== -1)
          return true;
        else
          return false;
      }
    } catch (error) {
      throw new Error("Erreur : depuis isRoomBan");
    }
  }

  async isRoomOwner(roomName: string, username: string): Promise<boolean> {
    try {
      const room = await this.prismaService.prisma.room.findUnique({
        where: {name: roomName},
      });
      if (room.name == username)
        return true;
      return false;
    }
    catch (error) {
      throw new Error("Erreur : depuis isRoomOwner");
    }
  }

  async roomExist(roomName: string): Promise<boolean> {
    try {
      const room = await this.prismaService.prisma.room.findUnique({
        where: {name: roomName},
      });
      if (!room)
        return false;
      return true;
    } catch (error) {
      throw new Error("Erreur : depuis roomExist");
    }
  }
  //GET fun ----------------------------------------------------------------------------------------------------
  
  async getPrivate(name: string): Promise<boolean | null> {
    try {
      const room = await this.prismaService.prisma.room.findUnique({
        where: {name},
        select: {private: true},
      });
      if (!room)
        return null;
      return room.private;
    } catch (error) {
      throw new Error("Erreur : impossible de savoir si la room est privé depuis getPrivate");
    }
  }

  async getPass(name: string): Promise<string | null> {
    try {
      const room = await this.prismaService.prisma.room.findUnique({
        where: {name},
        select: {password: true},
      });
      if (!room)
        return null;
      return room.password;
    } catch (error) {
      throw new Error("Erreur : impossible de connaitre le mot de passe depuis getPass");
    }
  }

  async getOwner(name: string): Promise<string | null> {
    try {
      const room = await this.prismaService.prisma.room.findUnique({
        where: {name},
        select: {owner: true},
      });
      if (!room)
        return null;
      return room.owner;
    } catch (error) {
      throw new Error("Erreur : impossible de connaitre le proprietaire de la room depuis getOwner");
    }
  }

  async getUserList(roomName: string): Promise<string[] | null> {
    try {
      const user = await this.prismaService.prisma.room.findUnique({
        where: {name: roomName},
        select: {userList: true},
      });
      if (!user)
        return null;
      return user.userList;
    } catch (error) {
      throw new Error("Erreur : impossible d'obtenir la userList depuis getUserList");
    }
  }

  async getAdminList(roomName: string): Promise<string[] | null> {
    try {
      const user = await this.prismaService.prisma.room.findUnique({
        where: {name: roomName},
        select: {adminList: true},
      });
      if (!user)
        return null;
      return user.adminList;
    } catch (error) {
      throw new Error("Erreur : impossible d'obtenir la userList depuis getAdminList");
    }
  }

  async getBanList(roomName: string): Promise<string[] | null> {
    try {
      const user = await this.prismaService.prisma.room.findUnique({
        where: {name: roomName},
        select: {banList: true},
      });
      if (!user)
        return null;
      return user.banList;
    } catch (error) {
      throw new Error("Erreur : impossible d'obtenir la userList depuis getBanList");
    }
  }

  async getPublicRooms(): Promise<any> {
    try {
      const publicRooms = await this.prismaService.prisma.room.findMany({
        where: { private: false },
      });
  
      return publicRooms;
    } catch (error) {
      throw new Error("Erreur : impossible de récupérer les salles de discussion publiques.");
    }
  }

  //Up Fun ---------------------------------------------------------------------------------------------------
  
  async updateRoomPass(name: string, newPass: string): Promise<string | null> {
    try {
      const room = await this.prismaService.prisma.room.findUnique({
        where: {name},
      });
      if (!room)
        return null;
      else {
        await this.prismaService.prisma.room.update({
          where: {name},
          data: {password: newPass},
        });
        const roomAfterUpdate = await this.prismaService.prisma.room.findUnique({
          where: {name},
        });
        return roomAfterUpdate.password;
      }
    } catch (error) {
      throw new Error("Erreur : impossible de modifier le password depuis updateRoomPass");
    }
  }

  async updateOwner(name: string, newOwner: string | null): Promise<string | null> {
    try {
      const room = await this.prismaService.prisma.room.findUnique({
        where: {name},
      });
      if (!room)
        return null;
      else {
        await this.prismaService.prisma.room.update({
          where: {name},
          data: {owner: newOwner},
        });
        const roomAfterUpdate = await this.prismaService.prisma.room.findUnique({
          where: {name},
        });
        return roomAfterUpdate.password;
      }
    } catch (error) {
      throw new Error("Erreur : impossible de modifier le password depuis updateRoomPass");
    }
  }
  
  async switchRoomPrivate(name: string): Promise<boolean | null> {
    try {
      const room = await this.prismaService.prisma.room.findUnique({
        where: {name},
      });
      if (!room)
        return null;
      else {
        await this.prismaService.prisma.room.update({
          where: {name},
          data: {
            private: true,
          },
        });
        const roomAfterUpdate = await this.prismaService.prisma.room.findUnique({
          where: {name},
        });
        return roomAfterUpdate.private;
      }
    } catch (error) {
      throw new Error("Erreur : impossible de modifier FA2 depuis switchFA2");
    }
  }
  
  //MSG FUN ----------------------------------------------------------------------------------------------------
  //MSG FUN ----------------------------------------------------------------------------------------------------
  //MSG FUN ----------------------------------------------------------------------------------------------------
  //MSG FUN ----------------------------------------------------------------------------------------------------

    async saveRoomMessage(senderUsername: string, roomName: string, content: string): Promise<any> {
      try {
        const room = await this.prismaService.prisma.room.findUnique({
          where: { name: roomName },
          include: { messages: true },
        });
        if (!room) {
          return null;
        }
        const newMessage = await this.prismaService.prisma.msgHistory.create({
          data: {
            msg: content,
            sender: senderUsername, 
            room: {
              connect: { name: roomName },
            },
          },
        });
        room.messages.push(newMessage);
        return newMessage;
      } catch (error) {
        throw new Error("Erreur : impossible de créer le message.");
      }
    }

    async getMsgHistory(name: string): Promise<any> {
      try {
        const room = await this.prismaService.prisma.room.findUnique({
          where: {name},
          select: {messages: true},
        });
        if (!room)
          return null;
        return room.messages;
      } catch (error) {
        throw new Error("Erreur : depuis getMsgHistory");
      }
    }


  async getMessagesSent(username: string): Promise<any> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
        select: {msgSent: {
          include: {
            sender: {
              select: {
                username: true
              }
            },
            receiver: {
              select: {
                username: true
              }
            }
          }
        }},
      });
      if (!user)
        return null;
      return user.msgSent;
    } catch (error) {
      throw new Error("Erreur : getMessagesSent");
    }
  }

  async getMessagesReceived(username: string): Promise<any> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: {username},
        select: {msgReceived: {
          include: {
            sender: {
              select: {
                username: true
              }
            },
            receiver: {
              select: {
                username: true
              }
            }
          }
        }},
      });
      if (!user)
        return null;
      return user.msgReceived;
    } catch (error) {
      throw new Error("Erreur : getMessagesReceived");
    }
  }

    async savePrivateMessage(senderName: string, recipientName: string, content: string): Promise<any> {
      try {
        const sender = await this.prismaService.prisma.userData.findUnique({
          where: { username: senderName },
        });
        if (!sender) {
          return null;
        }
        const recipient = await this.prismaService.prisma.userData.findUnique({
          where: { username: recipientName },
        });
        if (!recipient) {
          return null;
        }
        const msgForSender = await this.prismaService.prisma.directMessage.create({
          data: {
            content: content,
            sender: {
              connect: { id: sender.id },
            },
            receiver: {
              connect: { id: recipient.id },
            },
          },
          include: {
            sender: true,
            receiver: true
          }
        });
        return msgForSender;
      } catch (error) {
        throw new Error("Erreur lors de l'enregistrement du message privé");
      }
    }

    async getUsersConversation(username1: string, username2: string): Promise<any> {
      try {
        const user1 = await this.prismaService.prisma.userData.findUnique({
          where: { username: username1 },
        });
        if (!user1) {
          throw new Error("Utilisateur introuvable.");
        }
        const user2 = await this.prismaService.prisma.userData.findUnique({
          where: { username: username2 },
        });
        if (!user2) {
          throw new Error("Utilisateur introuvable.");
        }
        const directMessages = await this.prismaService.prisma.directMessage.findMany({
          where:{
            OR: [ 
              {
                senderId: user1.id,
                receiverId: user2.id,
              },
              {
                senderId: user2.id,
                receiverId: user1.id,
              },
            ],
          },
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                username: true
              }
            },
            receiver: {
              select: {
                username: true
              }
            }
          }
        });
        return directMessages;
      } catch (error) {
        throw new Error("Erreur : getUsersConversation");
      }
    }
    
  
  //------------------------------------------------------------------------------------------------------------
  
  //SCORE FUN ----------------------------------------------------------------------------------------------------
  //SCORE FUN ----------------------------------------------------------------------------------------------------
  //SCORE FUN ----------------------------------------------------------------------------------------------------
  //SCORE FUN ----------------------------------------------------------------------------------------------------
  
  async saveScore(user1: string, user2: string, u1score: number, u2score: number): Promise<any> {
    try {
      const u1 = await this.prismaService.prisma.userData.findUnique({
        where: { username: user1 },
      });
      if (!u1)
        throw new Error("Utilisateur introuvable");
      const u2 = await this.prismaService.prisma.userData.findUnique({
        where: { username: user2 },
      });
      if (!u2)
        throw new Error("Utilisateur introuvable");
      let winner: number;
      if (u1score > u2score)
        winner = u1.id;
      else
        winner = u2.id;
      const newScore = await this.prismaService.prisma.score.create({
        data: {
          user1Id: u1.id,
          user2Id: u2.id,
          winnerId: winner,
          u1Score: u1score,
          u2Score: u2score,
        }
      })
      return newScore;
    } catch (error) {
      throw new Error(error + "\nErreur : saveScore");
    }
  }
  
  async getScoresBetweenTwoUser(user1: string, user2: string): Promise<any> {
    try {
      const u1 = await this.prismaService.prisma.userData.findUnique({
        where: { username: user1 },
      });
      if (!u1)
        throw new Error("Utilisateur introuvable");
      const u2 = await this.prismaService.prisma.userData.findUnique({
        where: { username: user2 },
      });
      if (!u2)
        throw new Error("Utilisateur introuvable");
      const scores = await this.prismaService.prisma.score.findMany({
        where: {
          OR: [ 
            {
              user1Id: u1.id,
              user2Id: u2.id, 
            },
            {
              user1Id: u2.id,
              user2Id: u1.id, 
            },
          ],
        },
        orderBy: {id: "asc"},
      });
      return scores;
    } catch (err) {
      throw new Error("Erreur : getScores")
    }
  }

  async getTotalScoreBetweenTwoUsers(user1: string, user2: string): Promise<String> {
    let u1Score: number = 0;
    let u2Score: number = 0;
    const u1 = await this.getUserInformation(user1);
    const u2 = await this.getUserInformation(user2);
    const scores = await this.getScoresBetweenTwoUser(user1, user2);
    for (let i = 0; i < scores.length; i++) {
      if (scores[i].winnerId === u1.id)
        u1Score++;
      else if (scores[i].winnerId === u2.id)
        u2Score++;
    }
    return u1Score + " : " +  u2Score;
  }

  async getScoresForUser(username: string): Promise<any> {
    try {
      const user = await this.prismaService.prisma.userData.findUnique({
        where: { username },
      });
      if (!user) {
        throw new Error("Utilisateur introuvable");
      }
  
      const scores = await this.prismaService.prisma.score.findMany({
        where: {
          OR: [
            { user1Id: user.id },
            { user2Id: user.id },
          ],
        },
        orderBy: { createdAt: "asc" }, // Ou "desc" si vous voulez trier par date décroissante
      });
      return scores;
    } catch (err) {
      throw new Error("Erreur : getScoresForUser");
      // return (null);
    }
  }
  

  
  //------------------------------------------------------------------------------------------------------------
  // UTILS
}