import React, { useCallback, useEffect, useState } from 'react'
import DataTable from '../../../components/global/datatable/Datatable.component'
import { DATA_LOAD_TIME } from '../../../../constants'
import AppHelper from '../../../../helpers/app.helper'
import { Link, useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import SlideService from '../service/Slide.service'
import {
  DATATABLE_METADATA_DEFAULT,
  DATATABLE_OPTIONS_DEFAULT
} from '../../../components/global/datatable/datatable.constant'
// import { ErrorMessage } from '@hookform/error-message'
import ImageInput from '../../../components/global/form/imageInput.component'
import { FormControl } from 'react-bootstrap'
import InputField from '../../../components/global/fields/Input.field'
import SelectField from '../../../components/global/fields/Select.field'
import firebase from 'firebase/app'
import CategoryService from 'app/modules/Categories/service/Category.service'

function SlideAddPage() {
  const history = useHistory()
  const [options, setOptions] = useState(DATATABLE_OPTIONS_DEFAULT)
  const [loading, setLoading] = useState(false)
  const [metadata, setMetadata] = useState(DATATABLE_METADATA_DEFAULT)
  const [categories, setCategories] = useState([])
  const [thumbnail, setThumbnail] = useState('')
  const [slide, setSlide] = useState([])
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit
  } = useForm()
  useEffect(() => {
    const getCategories = async () => {
      try {
        const { data } = await CategoryService.list()
        setCategories(data)
      } catch (error) {
        console.log(error)
      }
    }
    getCategories()
  }, [])

  const onHandSubmit = async (data) => {
    const file = data.image[0]
    let storageRef = firebase.storage().ref(`images/${file.name}`)
    storageRef
      .put(file)
      .then(() => {
        storageRef.getDownloadURL().then(async (url) => {
          const newData = {
            ...data,
            image: url
          }
          await SlideService.store(newData)
          console.log(newData)
          history.push('/slides/list')
        })
      })
      .catch((err) => console.log('erorr', err))
  }

  return (
    <section className="section-all">
      <div className="container">
        <div className="card-header">
          <div className="card-title">
            <h3 className="card-label">Th??m slide</h3>
          </div>
          <div className="card-toolbar">
            <Link type="button" to="/slides/list" className="btn btn-light">
              <i className="fa fa-arrow-left" />
              Quay l???i
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
                    <div className="col-lg-12">
                      <InputField
                        id="name"
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="T??n"
                        ref={register({
                          required: 'Vui l??ng nh???p t??n '
                        })}
                        label="Name"
                        error={errors.name}
                      />
                      <InputField
                        id="image"
                        type="file"
                        className="form-control"
                        name="image"
                        id="product-photo"
                        ref={register({
                          required: 'Vui l??ng ch???n ???nh '
                        })}
                        label="H??nh ???nh"
                        error={errors.image}
                      />

                      {errors.photo && <span className="text-danger mt-2">B???n ch??a ??i???n th??ng tin</span>}
                      <div className="form-floating">
                        <label htmlFor="floatingSelect">Danh m???c</label>
                        <select
                          className="form-select"
                          id="floatingSelect"
                          name="cate_id"
                          ref={register({
                            required: 'Vui l??ng ch???n danh m???c '
                          })}
                          error={errors.cate_id}
                        >
                          {categories == null ? (
                            <option value="0">Ch??a c?? danh m???c n??o</option>
                          ) : (
                            <>
                              {categories.map((category, index) => (
                                <option
                                  key={index}
                                  value={`${category.id}`}
                                  ref={register({
                                    required: 'Vui l??ng ch???n danh m???c '
                                  })}
                                  error={errors.cate_id}
                                >
                                  {category.name}
                                </option>
                              ))}
                            </>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="btn_ text-center mt-4">

                <Link to="/slides" className="btn btn-success font-weight-bolder back_vc font-size-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11 5L4 12L11 19"
                      stroke="#fff"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path d="M4 12H20" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  Quay l???i
                </Link>
                <button class="btn btn-primary" type="submit">
                  L??u
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SlideAddPage
