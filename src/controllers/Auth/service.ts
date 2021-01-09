import ms from 'ms'
import models from 'models'
import jwt from 'jsonwebtoken'
import { isObject } from 'lodash'
import schema from 'controllers/User/schema'
import createDirNotExist from 'utils/Directory'
import useValidation from 'helpers/useValidation'
import ResponseError from 'modules/Response/ResponseError'
import { getUniqueCodev2, getReferralCode } from 'helpers/Common'
import { UserAttributes, LoginAttributes, TokenAttributes } from 'models/user'
import SendMail from 'helpers/SendEmail'
import RefreshTokenService from 'controllers/RefreshToken/service'
import UserService from 'controllers/User/service'
import db from 'models/_instance'

const { Sequelize } = db

const { Op } = Sequelize

const { User, Role } = models

const { JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN }: any = process.env

const JWT_ACCESS_TOKEN_EXPIRED = process.env.JWT_ACCESS_TOKEN_EXPIRED || '1d' // 7 Days
const JWT_REFRESH_TOKEN_EXPIRED = process.env.JWT_REFRESH_TOKEN_EXPIRED || '30d' // 30 Days

const expiresIn = ms(JWT_ACCESS_TOKEN_EXPIRED) / 1000

/*
  Create the main directory
  The directory will be created automatically when logged in,
  because there is a directory that uses a User ID
*/
async function createDirectory(UserId: string) {
  const pathDirectory = [
    './public/uploads/csv',
    './public/uploads/pdf',
    './public/uploads/excel',
    `./public/uploads/profile/${UserId}`,
  ]

  pathDirectory.map((x) => createDirNotExist(x))
}

class AuthService {
  /**
   *
   * @param formData
   */
  public static async signUp(formData: UserAttributes) {
    const generateToken = {
      code: getUniqueCodev2(),
    }

    const tokenVerify = jwt.sign(
      JSON.parse(JSON.stringify(generateToken)),
      JWT_SECRET_ACCESS_TOKEN,
      {
        expiresIn,
      }
    )

    const newFormData = {
      ...formData,
      tokenVerify,
      referralCode: getReferralCode(),
    }

    if (formData.referredByCode) {
      const findUserByReferral = await User.findAll({
        where: {
          referralCode: {
            [Op.eq]: formData.referredByCode,
          },
        },
      })
      if (findUserByReferral.length > 0) {
        newFormData.referredByCode = formData.referredByCode
      }
    }

    const value = useValidation(schema.create, newFormData)

    const data = await User.create(value)

    // Initial Send an e-mail
    SendMail.AccountRegister(formData, tokenVerify)

    return {
      message:
        'registration is successful, check your email for the next steps',
      data,
    }
  }

  /**
   *
   * @param formData
   */
  public static async signIn(formData: LoginAttributes) {
    const { email, password } = formData
    const userData = await User.scope('withPassword').findOne({
      where: { email },
    })

    if (!userData) {
      throw new ResponseError.NotFound('data not found or has been deleted')
    }

    /* User active proses login */
    if (userData.active) {
      // @ts-ignore
      const comparePassword = await userData.comparePassword(password)

      if (comparePassword) {
        // modif payload token
        const payloadToken = {
          id: userData.id,
          nama: userData.fullName,
          email: userData.email,
          active: userData.active,
        }

        // Access Token
        const accessToken = jwt.sign(
          JSON.parse(JSON.stringify(payloadToken)),
          JWT_SECRET_ACCESS_TOKEN,
          {
            expiresIn,
          }
        )

        // Refresh Token
        const refreshToken = jwt.sign(
          JSON.parse(JSON.stringify(payloadToken)),
          JWT_SECRET_REFRESH_TOKEN,
          {
            expiresIn: JWT_REFRESH_TOKEN_EXPIRED,
          }
        )

        const formDataRefreshToken = {
          UserId: userData.id,
          token: refreshToken,
        }

        await RefreshTokenService.create(formDataRefreshToken)

        // create directory
        await createDirectory(userData.id)

        return {
          accessToken,
          expiresIn,
          tokenType: 'Bearer',
          refreshToken,
        }
      }

      throw new ResponseError.BadRequest('incorrect email or password!')
    }

    /* User not active return error confirm email */
    throw new ResponseError.BadRequest(
      'please check your email account to verify your email and continue the registration process.'
    )
  }

  /**
   *
   * @param token
   */
  public static async profile(token: TokenAttributes) {
    if (isObject(token?.data)) {
      const decodeToken = token?.data
      const including = [{ model: Role }]

      // @ts-ignore
      const data = await User.findByPk(decodeToken?.id, { include: including })
      return data
    }

    throw new ResponseError.Unauthorized(
      `${token?.message}. Please Re-login...`
    )
  }

  /**
   *
   * @param userId
   */
  public static async logout(userId: string) {
    const { data } = await UserService.getOne(userId)

    // remove refresh token by user id
    await RefreshTokenService.delete(data.id)
    const message = 'You have logged out of the application'

    return message
  }
}

export default AuthService
