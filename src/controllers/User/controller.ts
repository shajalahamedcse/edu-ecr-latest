import { Request, Response } from 'express'
import routes from 'routes/public'
import asyncHandler from 'helpers/asyncHandler'
import Authorization from 'middlewares/Authorization'
import BuildResponse from 'modules/Response/BuildResponse'
import UserService from 'controllers/User/service'
import { checkPermission } from 'middlewares/Permission'
import { CREATE_USER, UPDATE_USER, DELETE_USER, READ_USER } from './permissions'

routes.get(
  '/user',
  [Authorization, checkPermission(READ_USER)],
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { message, data, total } = await UserService.getAll(req)
    const buildResponse = BuildResponse.get({ message, data, total })

    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/user/:id',
  [Authorization, checkPermission(READ_USER)],
  asyncHandler(async function getOne(req: Request, res: Response) {
    const { id } = req.getParams()

    const { data, users } = await UserService.getOne(id)
    const buildResponse = BuildResponse.get({ data, users })

    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/user',
  [Authorization, checkPermission(CREATE_USER)],
  asyncHandler(async function createData(req: Request, res: Response) {
    const txn = await req.getTransaction()
    const formData = req.getBody()

    const data = await UserService.create(formData, txn)
    const buildResponse = BuildResponse.created({ data })

    await txn.commit()
    return res.status(201).json(buildResponse)
  })
)

routes.put(
  '/user/:id',
  [Authorization, checkPermission(UPDATE_USER)],
  asyncHandler(async function updateData(req: Request, res: Response) {
    const txn = await req.getTransaction()
    const formData = req.getBody()
    const { id } = req.getParams()

    const data = await UserService.update(id, formData, txn)
    const buildResponse = BuildResponse.updated({ data })

    await txn.commit()
    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/user/:id',
  [Authorization, checkPermission(DELETE_USER)],
  asyncHandler(async function deleteData(req: Request, res: Response) {
    const { id } = req.getParams()

    await UserService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    return res.status(200).json(buildResponse)
  })
)
