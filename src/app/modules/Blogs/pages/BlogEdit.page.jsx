import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import AppHelper from '../../../../helpers/app.helper'
import { DATA_LOAD_TIME } from '../../../../constants'
import {
  DATATABLE_METADATA_DEFAULT,
  DATATABLE_OPTIONS_DEFAULT
} from '../../../components/global/datatable/datatable.constant'
import { useHistory, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import InputField from '../../../components/global/fields/Input.field'
import firebase from '../../../../firebase/config'
import BlogService from '../service/Blog.service'

function BlogsEditPage() {
  const [options, setOptions] = useState(DATATABLE_OPTIONS_DEFAULT)
  const [loading, setLoading] = useState(false)
  const [metadata, setMetadata] = useState(DATATABLE_METADATA_DEFAULT)
  const [blog, setBlog] = useState([])
  const [imageChange, setImageChange] = useState('')
  const { id } = useParams()
  const history = useHistory()
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit
  } = useForm()
  const loadBlogs = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      BlogService.find(id).then((res) => {
        setBlog(res.data)
        setImageChange(res.data.image)
        reset(res.data)
        setLoading(false)
      })
    }, DATA_LOAD_TIME)
  }, [options])
  useEffect(() => {
    AppHelper.setTitle('Blogs')
    loadBlogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options])
  const handleChangeImage = (e) => {
    const file = e.target.files[0]
    let storageRef = firebase.storage().ref(`images/${file.name}`)
    storageRef
      .put(file)
      .then(() => {
        storageRef.getDownloadURL().then((url) => {
          setImageChange(url)
        })
      })
      .catch((err) => console.log('erorr', err))
  }
  const onHandSubmit = async (data) => {
    const newData = {
      ...data,
      image: imageChange
    }

    await BlogService.update(id, newData)
    history.push('/blogs/list')
  }

  return (
    <div className="card card-custom gutter-b">
      <div className="d-flex flex-column-fluid">
        <div className="container">
          <div className="card card-custom gutter-b">
            <div className="card-header">
              <div className="card-title">
                <h3 className="card-label">S???a Blog</h3>
              </div>
              <div className="card-toolbar">
                <Link type="button" to="/blogs/list" className="btn btn-light">
                  <i className="fa fa-arrow-left" />
                  Tr??? l???i
                </Link>
              </div>
            </div>
            <div className="card-body">
              <ul className="nav nav-tabs nav-tabs-line " role="tablist">
                <li className="nav-item">
                  <a className="nav-link active" data-toggle="tab" role="tab" aria-selected="true">
                    Th??ng tin
                  </a>
                </li>
              </ul>
              <div className="mt-5">
                <form onSubmit={handleSubmit(onHandSubmit)} className="form form-label-right">
                  <div className="form-group row">
                    <div className="col-lg-8">
                      <div className="row mb-5">
                        <div className="col-lg-6">
                          <InputField
                            id="title"
                            type="text"
                            className="form-control"
                            name="title"
                            placeholder="Ti??u ?????"
                            ref={register({
                              required: true,
                              minLength :2
                            })}
                            label="Nh???p ti??u ????? d?????i 50 k?? t???"
                            error={errors.title}
                          />
                          {errors.title && (
                            <div className="feedback mt-3 text-danger">
                              H??y nh???p <b>ti??u ????? tr??n 2 k?? t??? </b>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <img className="mb-3" src={blog.image} width="240px" />
                    <input type="file" class="form-control" name="image" onChange={handleChangeImage} />
                  </div>
                  <div className="form-group">
                    <label>N???i dung</label>
                    <textarea
                      name="content"
                      className="form-control"
                      ref={register({
                        required: true,
                        minLength :10
                      })}
                      error={errors.content}
                    />
                    {errors.content && (
                      <div className="feedback mt-3 text-danger">
                        H??y nh???p <b>n???i dung tr??n 10 k?? t??? </b>
                      </div>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary">
                    L??u
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogsEditPage
