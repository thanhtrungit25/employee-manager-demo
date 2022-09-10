import { Controller } from 'react-hook-form'
import TextField from '@material-ui/core/TextField';

export default function FormTextField({ control: providedControl, name, rules, ...rest }) {
  return (
    <Controller
      control={providedControl}
      name={name}
      rules={rules}
      render={({ field: { value, onBlur, ...field }, fieldState: { error } }) => (
        <TextField
          {...rest}
          onBlur={onBlur}
          error={error !== undefined}
          helperText={error?.message}
          value={value ?? ''}
          {...field}
        />
      )}
    />
  )
}