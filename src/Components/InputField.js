const InputField = ({ type, formik, label, placeholder, name, children, options = []}) => {
  if (type === "text") {
    return (
      <div className="mb-3">
        {label && (
          <label className="form-label" htmlFor={name}>
            {label}
          </label>
        )}
        <input
          className="form-control"
          type="text"
          id={name}
          name={name}
          placeholder={placeholder}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
        />
        {
            children
        }
        {formik.touched[name] && formik.errors[name] ? (
          <div className="text-danger">{formik.errors[name]}</div>
        ) : null}
      </div>
    );
  }

  if (type === "date") {
    return (
      <div className="mb-3">
        {label && (
          <label className="form-label" htmlFor={name}>
            {label}
          </label>
        )}
        <input
          className="form-control"
          type="date"
          id={name}
          name={name}
          placeholder={placeholder}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
        />
        {
            children
        }
        {formik.touched[name] && formik.errors[name] ? (
          <div className="text-danger">{formik.errors[name]}</div>
        ) : null}
      </div>
    );
  }

  if (type === "email") {
    return (
      <div className="mb-3">
        {
            label && <label className="form-label" htmlFor={name}>
            {label}
          </label>
        }
        <input
          className="form-control"
          type="email"
          id={name}
          name={name}
          placeholder={placeholder}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
        />
        {formik.touched[name] && formik.errors[name] ? (
          <div className="text-danger">{formik.errors[name]}</div>
        ) : null}
      </div>
    );
  }

  if (type === "password") {
    return (
      <div className="mb-3">
        {
            label && <label className="form-label" htmlFor={name}>
            {label}
          </label>
        }
        <input
          className="form-control"
          type="password"
          id={name}
          name={name}
          placeholder={placeholder}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
        />
        {
            children
        }
        {formik.touched[name] && formik.errors[name] ? (
          <div className="text-danger">{formik.errors[name]}</div>
        ) : null}
      </div>
    );
  }

  if (type === "file") {
    return (
      <div className="mb-3">
        {
            label && <label className="form-label" htmlFor={name}>
            {label}
          </label>
        }
        <input
          className="form-control"
          type="file"
          id={name}
          name={name}
          placeholder={placeholder}
          onChange={e => formik.setFieldValue(name, e.target.files[0])}
          onBlur={formik.handleBlur}
          //value={formik.values[name]}
        />
        {
            children
        }
        {formik.touched[name] && formik.errors[name] ? (
          <div className="text-danger">{formik.errors[name]}</div>
        ) : null}
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className="mb-3">
        {label && (
          <label className="form-label" htmlFor={name}>
            {label}
          </label>
        )}
        <select
          className="form-select"
          type="text"
          id={name}
          name={name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
        >
          <option value={""}>{placeholder}</option>
          {
            options.map((data,idx) => {

              return <option key={idx} value={data.slug}>{data.label}</option>
            })
          }
        </select>
        {
            children
        }
        {formik.touched[name] && formik.errors[name] ? (
          <div className="text-danger">{formik.errors[name]}</div>
        ) : null}
      </div>
    );
  }

  if (type === "textaera") {
    return (
      <div className="mb-3">
        {label && (
          <label className="form-label" htmlFor={name}>
            {label}
          </label>
        )}
        <textarea
          className="form-control"
          id={name}
          name={name}
          placeholder={placeholder}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
          rows="4"
        ></textarea>
        {
            children
        }
        {formik.touched[name] && formik.errors[name] ? (
          <div className="text-danger">{formik.errors[name]}</div>
        ) : null}
      </div>
    );
  }

  return null;
};

export default InputField;
