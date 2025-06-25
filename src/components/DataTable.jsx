import { BiSortUp, BiSortDown } from "react-icons/bi";
import PropTypes from "prop-types";

const DataTable = ({
  columns,
  data,
  editable = false,
  sortColumn,
  sortDirection,
  onSort,
  onEdit,
  rowIdKey = "id"
}) => {
  const getRowId = (row) => row[rowIdKey];

  return (
    
      <table className="styled-table">
      <thead>
        <tr>
          {columns.map(col => (
            <th
            key={col.key}
            className={`${col.className || ""} ${col.sortable ? "sortable" : ""}`}
            onClick={() => col.sortable && onSort(col.key)}
            >
          
              {col.label}
              {col.sortable && sortColumn === col.key && (
                sortDirection === "asc" ? <BiSortUp /> : <BiSortDown />
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={row[rowIdKey] || idx}>
            {columns.map(col => (
              <td key={col.key} className={col.className || ""}>
                {col.render ? (
                  col.render(row)
                ) : editable ? (
                  <input
                    className="form-input"
                    value={row[col.key] || ""}
                    onChange={(e) =>
                      onEdit(row[rowIdKey], col.key, e.target.value)
                    }
                  />
                ) : (
                  row[col.key]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>     
    </table>

  );
};

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  editable: PropTypes.bool,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.string,
  onSort: PropTypes.func,
  onEdit: PropTypes.func,
  rowIdKey: PropTypes.string
};

export default DataTable;

