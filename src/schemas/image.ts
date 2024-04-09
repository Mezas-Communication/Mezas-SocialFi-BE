/* eslint-disable import/no-duplicates */
import type * as Sequelize from 'sequelize'
import { DataTypes, Model, type Optional } from 'sequelize'

export interface imageAttributes {
  id: number
  url: string
}

export type imagePk = 'id'
export type imageId = image[imagePk]
export type imageOptionalAttributes = 'id'
export type imageCreationAttributes = Optional<
  imageAttributes,
  imageOptionalAttributes
>

export class image
  extends Model<imageAttributes, imageCreationAttributes>
  implements imageAttributes
{
  id!: number
  url!: string

  static initModel(sequelize: Sequelize.Sequelize): typeof image {
    return image.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        url: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'image',
        schema: 'dev',
        timestamps: false,
        indexes: [
          {
            name: 'image_id_uindex',
            unique: true,
            fields: [{ name: 'id' }]
          },
          {
            name: 'image_pk',
            unique: true,
            fields: [{ name: 'id' }]
          }
        ]
      }
    )
  }
}
