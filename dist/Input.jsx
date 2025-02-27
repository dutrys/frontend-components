import { Controller, } from "react-hook-form";
import { DateTimePicker } from "./DateTimePicker";
import { DatePicker } from "./DatePicker";
import { InputErrors } from "./Form";
import { format } from "date-fns";
import { SelectPaginatedFromApi } from "./SelectPaginatedFromApi";
import { stringToDate } from "./utils/datetime";
export const TextInput = (props) => {
    return (<div>
      <label className="floating-label">
        <input id={props.id} type={props.type || "text"} {...props.register(props.name, props.options)} required={props.required} disabled={props.disabled} placeholder={props.label} className={`input input-bordered w-full ${props.className || ""} ${props.error ? " input-error" : ""}`}/>
        <span>
          {props.label}
          {props.required ? <Required /> : null}
        </span>
      </label>
      {props.desc && <div className="text-xs mt-0.5 text-gray-500">{props.desc}</div>}
      {props.error && <InputErrors className="text-xs text-error mt-1" errors={props.error}/>}
    </div>);
};
export const SelectInput = (props) => {
    return (<div>
      <label className="floating-label">
        <select id={props.id} disabled={props.disabled} {...props.register(props.name, props.options)} className={`select select-bordered w-full ${props.className || ""} ${props.error ? " select-error" : ""}`}>
          {props.children}
        </select>
        <span>
          {props.label}
          {props.required ? <Required /> : null}
        </span>
      </label>
      {props.desc && <div className="text-xs mt-0.5 text-gray-500">{props.desc}</div>}
      {props.error && <InputErrors className="text-xs text-error mt-1" errors={props.error}/>}
    </div>);
};
export const TextareaInput = (props) => {
    return (<div>
      <label className="floating-label">
        <textarea id={props.id} disabled={props.disabled} {...props.register(props.name, props.options)} className={`textarea textarea-bordered w-full ${props.className || ""} ${props.error ? " textarea-error" : ""}`}/>
        <span>
          {props.label}
          {props.required ? <Required /> : null}
        </span>
      </label>
      {props.desc && <div className="text-xs mt-0.5 text-gray-500">{props.desc}</div>}
      {props.error && <InputErrors className="text-xs text-error mt-1" errors={props.error}/>}
    </div>);
};
const Required = () => {
    return <span className="text-error align-bottom">*</span>;
};
export const CheckboxInput = (props) => {
    return (<div>
      <label>
        <input id={props.id} type="checkbox" disabled={props.disabled} {...props.register(props.name, props.options)} className="toggle"/>
        <span className="text-sm text-gray-500 label-text grow pl-2">{props.label}</span>
      </label>
      {props.desc && <div className="text-xs mt-0.5 text-gray-500">{props.desc}</div>}
      {props.error && <InputErrors className="text-xs text-error mt-1" errors={props.error}/>}
    </div>);
};
export const DateInput = (props) => {
    return (<div>
      <label className="floating-label">
        <Controller control={props.control} name={props.name} render={({ field }) => {
            return (<DatePicker inputClassName={`input input-bordered ${props.className || ""} ${props.error ? " input-error" : ""}`} allowEmpty={props.allowEmpty} placeholder={props.label} value={field.value} onChange={(value) => {
                    if (props.useDate) {
                        field.onChange(value);
                    }
                    else {
                        field.onChange(value ? format(value, "yyyy-MM-dd") : null);
                    }
                }}/>);
        }}/>
        <span>
          {props.label}
          {props.required ? <Required /> : null}
        </span>
      </label>
      {props.desc && <div className="text-xs mt-0.5 text-gray-500">{props.desc}</div>}
      {props.error && <InputErrors className="text-xs text-error mt-1" errors={props.error}/>}
    </div>);
};
export const SelectPaginatedFromApiInput = ({ label, queryFn, queryKey, desc, control, name, valueFormat, required, disabled, error, onChange, ...rest }) => (<div {...rest} className="floating-label">
    <span>
      {label}
      {required ? <Required /> : null}
    </span>
    <Controller control={control} name={name} rules={{ required: required === true }} render={({ field }) => (<SelectPaginatedFromApi required={required} disabled={disabled} placeholder={label} queryKey={queryKey} queryFunction={queryFn} value={field.value} valueFormat={valueFormat} onChange={(model) => {
            field.onChange(model?.id || null);
            onChange?.(model || null);
        }}/>)}/>
    <InputErrors className="text-xs text-error mt-1" errors={error}/>
  </div>);
export const DateTimeInput = (props) => {
    return (<div>
      <label className="floating-label">
        <Controller control={props.control} name={props.name} render={({ field }) => {
            return (<DateTimePicker inputClassName={`input input-bordered ${props.className || ""} ${props.error ? " input-error" : ""}`} required={props.required} allowEmpty={props.allowEmpty} placeholder={props.label} from={props.from} disabled={props.disabled} to={props.to} value={field.value ? (props.useDate ? field.value : stringToDate(field.value)) || null : null} onChange={(value) => {
                    if (props.useDate) {
                        field.onChange(value);
                    }
                    else {
                        field.onChange(value ? format(value, "yyyy-MM-dd HH:mm:ss") : null);
                    }
                }}/>);
        }}/>
        <span>
          {props.label}
          {props.required ? <Required /> : null}
        </span>
      </label>
      {props.desc && <div className="text-xs my-0.5 text-gray-500">{props.desc}</div>}
      {props.error && <InputErrors className="text-xs text-error mt-1" errors={props.error}/>}
    </div>);
};
//# sourceMappingURL=Input.jsx.map