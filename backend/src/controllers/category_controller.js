const db = require("../config").promise()
const createError = require("../helper/create_error")
const createResponse = require("../helper/create_response")
const httpStatus = require("../helper/http_status_code")
const path = require("path")
const fs = require("fs")
const { categorySchema } = require("../helper/validation_schema")

module.exports.getCategory = async (req, res) => {
  try {

    const GET_CATEGORY = `SELECT * FROM categories;`

    const [categories] = await db.execute(GET_CATEGORY)

    if (!categories.length) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, 'Kategori tidak ditemukan'
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, 'kategori tidak ditemukan')
    }

    const responseStatus = new createResponse(
      httpStatus.OK,
      'success', true, 1, 1, categories
    )

    res.status(responseStatus.status).send(responseStatus)

  } catch (error) {
    console.log(error)
  }
}

module.exports.getCategoryByName = async (req, res) => {

  const categoryName = req.params.name

  try {

    const GET_CATEGORY_BY_NAME = `SELECT * FROM categories WHERE categoryName LIKE '%${categoryName}%';`

    const [categories] = await db.execute(GET_CATEGORY_BY_NAME)

    if (!categories.length) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, 'Kategori tidak ditemukan'
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, 'kategori tidak ditemukan')
    }

    const responseStatus = new createResponse(
      httpStatus.OK,
      'success', true, 1, 1, categories
    )

    res.status(responseStatus.status).send(responseStatus)

  } catch (error) {
    console.log(error)
  }
}

module.exports.getCategoryById = async (req, res) => {

  const idCategory = req.params.id

  try {

    const GET_CATEGORY_BY_ID = `SELECT * FROM categories WHERE id = ${idCategory};`

    const [categories] = await db.execute(GET_CATEGORY_BY_ID)

    if (!categories.length) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, 'Kategori tidak ditemukan'
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, 'kategori tidak ditemukan')
    }

    const responseStatus = new createResponse(
      httpStatus.OK,
      'success', true, 1, 1, categories
    )

    res.status(responseStatus.status).send(responseStatus)

  } catch (error) {
    console.log(error)
  }
}

module.exports.editCategory = async (req, res) => {

  const idCategory = req.params.id

  try {

    const { error } = categorySchema.validate(req.body)

    if (error) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, error.details[0].message
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, error.details[0].message)
    }

    const { categoryName, slug } = req.body

    const CATEGORY = `SELECT * FROM categories WHERE id = ${idCategory};`

    if (!CATEGORY.length) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, 'Data kategori tidak ditemukan'
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, 'kategori tidak ditemukan')
    }

    const UPDATE_CATEGORY = `UPDATE categories SET categoryName = ?, slug = ? WHERE id = ?;`

    await db.execute(UPDATE_CATEGORY, [categoryName, slug, idCategory])

    const responseStatus = new createResponse(
      httpStatus.OK,
      'success', true, 1, 1, "Category has been updated"
    )

    res.status(responseStatus.status).send(responseStatus)

  } catch (error) {
    console.log(error)
  }
}

module.exports.addCategory = async (req, res) => {
  try {

    const { error } = categorySchema.validate(req.body)

    if (error) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, error.details[0].message
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, error.details[0].message)
    }

    const { categoryName, slug } = req.body

    const CHECK_CATEGORY = `SELECT * FROM categories WHERE categoryName = ?;`

    const [category] = await db.execute(CHECK_CATEGORY, [categoryName])

    if (category.length) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, 'Kategori sudah ada'
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, 'kategori sudah ada')
    }

    const ADD_CATEGORY = `INSERT INTO categories(categoryName, slug) VALUES (${db.escape(categoryName)}, ${db.escape(slug)})`
    await db.execute(ADD_CATEGORY)

    const responseStatus = new createResponse(
      httpStatus.OK,
      'success', true, 1, 1, "Category has been added"
    )

    res.status(responseStatus.status).send(responseStatus)


  } catch (error) {
    console.log(error)
  }
}

module.exports.deleteCategory = async (req, res) => {
  const idCategory = req.params.id

  try {
    const CHECK_CATEGORY = `SELECT * FROM categories WHERE id = ?;`
    const [category] = await db.execute(CHECK_CATEGORY, [idCategory])

    if (!category.length) {
      const responseStatus = new createResponse(
        httpStatus.BAD_REQUEST,
        'Error', false, 1, 1, 'Kategori tidak ditemukan'
      )

      res.status(responseStatus.status).send(responseStatus)
      throw new createError(httpStatus.BAD_REQUEST, 'kategori tidak ditemukan')
    }

    const DELETE_CATEGORY = `DELETE FROM categories WHERE id = ?;`
    await db.execute(DELETE_CATEGORY, [idCategory])

    const responseStatus = new createResponse(
      httpStatus.OK,
      'success', true, 1, 1, "Data has been deleted"
    )

    res.status(responseStatus.status).send(responseStatus)

  } catch (error) {
    console.log(error)
  }
}