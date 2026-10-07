interface ReportPeriodFilterProps {
  value: string;
  startDate: string;
  endDate: string;
  onChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export function ReportPeriodFilter({
  value,
  startDate,
  endDate,
  onChange,
  onStartDateChange,
  onEndDateChange,
}: ReportPeriodFilterProps) {
  return (
    <div className="report-period-filter">
      <div className="report-period-select">
        <label htmlFor="report-period">
          Período
        </label>

        <select
          id="report-period"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
        >
          <option value="all">
            Todas las ventas
          </option>

          <option value="today">
            Hoy
          </option>

          <option value="7days">
            Últimos 7 días
          </option>

          <option value="30days">
            Últimos 30 días
          </option>

          <option value="month">
            Este mes
          </option>

          <option value="custom">
            Personalizado
          </option>
        </select>
      </div>

      {value === "custom" && (
        <div className="report-custom-dates">
          <div>
            <label htmlFor="report-start-date">
              Desde
            </label>

            <input
              id="report-start-date"
              type="date"
              value={startDate}
              onChange={(event) =>
                onStartDateChange(
                  event.target.value,
                )
              }
            />
          </div>

          <div>
            <label htmlFor="report-end-date">
              Hasta
            </label>

            <input
              id="report-end-date"
              type="date"
              value={endDate}
              onChange={(event) =>
                onEndDateChange(
                  event.target.value,
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}