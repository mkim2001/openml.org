import React from "react";
import {
  Button,
  Card,
  FormControlLabel,
  FormControl,
  Collapse,
  Chip as MuiChip,
  Tooltip
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { MainContext } from "../../App.js";

const FilterButton = styled(Button)`
  min-width: 0;
  width: 45px;
  height: 45px;
  font-size: 20px;
  margin-top: 2px;
  color: ${props => props.textcolor};
`;
const FilterStats = styled.div`
  padding-left: 15px;
  padding-top: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11pt;
  float: left;
  color: ${props => props.textcolor};
`;
const FilterChip = styled(MuiChip)`
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const FilterBox = styled.div`
  height: 60px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
`;
const FilterContainer = styled(Card)`
  background-color: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  cursor: pointer;
  box-shadow: 0 0 14px 0 rgba(53, 64, 82, 0.15);
  z-index: 200;
  position: relative;
  border-radius: 0px;
`;
const FilterFormControl = styled(FormControl)`
  background-color: #fff;
  flex-wrap: wrap;
  display: block;
`;
const FilterPanel = styled.div`
  background-color: #fff;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
`;
const FilterControl = styled(FormControlLabel)`
  float: right;
  margin-right: 10px;
`;
const FilterIcon = styled(FontAwesomeIcon)`
  cursor: "pointer";
  padding-left: 5px;
`;

const typeName = {
  data: "datasets",
  flow: "flows",
  run: "runs",
  study: "collections",
  task: "tasks",
  task_type: "task types",
  user: "users",
  measure: "measures"
};

export class FilterBar extends React.Component {
  static contextType = MainContext;

  constructor(props) {
    super(props);

    this.state = {
      showFilter: false,
      sortVisible: false,
      activeFilter: false
    };
  }

  sortChange = value => {
    console.log("Set sort to", value);
    this.props.sortChange({ sort: value });
  };

  orderChange = value => {
    console.log("Set order to", value);
    this.props.sortChange({ order: value });
  };

  activateFilter = value => {
    console.log(value);
    this.setState({ activeFilter: value });
  };

  filterChange = filters => {
    let filter = {
      name: this.props.filterOptions[this.state.activeFilter].value,
      type: filters.type,
      value: filters.value,
      value2: filters.value2
    };
    //this.setState({ showFilter: false });
    this.props.filterChange([filter]);
  };

  flipFilter = () => {
    this.setState(state => ({ showFilter: !state.showFilter }));
  };

  flipSorter = () => {
    this.setState(state => ({ sortVisible: !state.sortVisible }));
  };

  toggleSelect = () => {
    this.props.selectEntity(null);
  };

  isActiveOption = option => {
    let oname = this.props.filterOptions[this.state.activeFilter].value;
    if (oname in this.context.filters) {
      if (
        option.type === this.context.filters[oname].type &&
        option.value === this.context.filters[oname].value
      ) {
        return true;
      }
    }
    return false;
  };

  render() {
    return (
      <React.Fragment>
        <FilterContainer>
          <FilterBox>
            <FilterStats textcolor={this.props.searchColor}>
              {this.context.counts +
                " " +
                typeName[this.props.resultType] +
                " found"}
            </FilterStats>
            <Tooltip title="Filter results" placement="top-start">
              <FilterControl
                style={{
                  marginRight: window.innerWidth < 600 ? 10 : 3,
                  display: this.context.displaySearch ? "block" : "none"
                }}
                control={
                  <FilterButton
                    onClick={this.flipFilter}
                    textcolor={this.props.searchColor}
                  >
                    <FontAwesomeIcon icon="filter" />
                  </FilterButton>
                }
              />
            </Tooltip>
            <Tooltip title="Sort results" placement="top-start">
              <FilterControl
                style={{
                  display: this.context.displaySearch ? "block" : "none"
                }}
                control={
                  <FilterButton
                    onClick={this.flipSorter}
                    textcolor={this.props.searchColor}
                  >
                    <FontAwesomeIcon icon="sort-amount-down" />
                  </FilterButton>
                }
              />
            </Tooltip>
            <Tooltip
              title={
                window.innerWidth < 600 ? "Statistics" : "Hide result list"
              }
              placement="top-start"
            >
              <FilterControl
                style={{
                  display: this.context.displaySearch ? "block" : "none"
                }}
                control={
                  <FilterButton
                    onClick={this.context.collapseSearch}
                    textcolor={this.props.searchColor}
                  >
                    <FontAwesomeIcon
                      icon={window.innerWidth < 600 ? "chart-pie" : "times"}
                    />
                  </FilterButton>
                }
              />
            </Tooltip>
            <Tooltip title="Show result list" placement="top-start">
              <FilterControl
                style={{
                  display: this.context.displaySearch ? "none" : "block"
                }}
                control={
                  <FilterButton
                    onClick={this.toggleSelect}
                    textcolor={this.props.searchColor}
                  >
                    <FontAwesomeIcon icon="chevron-left" />
                  </FilterButton>
                }
              />
            </Tooltip>
          </FilterBox>
          <Collapse in={this.state.sortVisible}>
            <FilterPanel>
              <FilterFormControl>
                <FilterStats textcolor={this.props.searchColor}>
                  Sort by
                </FilterStats>
                {this.props.sortOptions.map(item => (
                  <FilterChip
                    label={item.name}
                    key={item.name}
                    clickable
                    onClick={() => this.sortChange(item.value)}
                    color={
                      this.context.sort === item.value ? "primary" : "default"
                    }
                    variant={
                      this.context.sort === item.value ? "default" : "outlined"
                    }
                  />
                ))}
                <FilterChip
                  label={
                    this.context.order === "desc" ? "Descending" : "Ascending"
                  }
                  key="order"
                  clickable
                  onClick={() =>
                    this.orderChange(
                      this.context.order === "desc" ? "asc" : "desc"
                    )
                  }
                  variant="outlined"
                  color="secondary"
                  icon={
                    this.context.order === "desc" ? (
                      <FilterIcon icon="chevron-down" />
                    ) : (
                      <FilterIcon icon="chevron-up" />
                    )
                  }
                />
              </FilterFormControl>
            </FilterPanel>
          </Collapse>
          <Collapse in={this.state.showFilter}>
            <FilterPanel>
              <FilterFormControl key="filters">
                <FilterStats textcolor={this.props.searchColor}>
                  Filter by
                </FilterStats>
                {Object.entries(this.props.filterOptions).map(
                  ([key, option]) => (
                    <FilterChip
                      label={option.name}
                      key={key}
                      clickable
                      onClick={() => this.activateFilter(option.name)}
                      color={
                        option.name === this.state.activeFilter
                          ? "primary"
                          : "default"
                      }
                      variant={
                        option.name === this.state.activeFilter
                          ? "default"
                          : "outlined"
                      }
                      icon={<FilterIcon icon="chevron-down" />}
                    />
                  )
                )}
              </FilterFormControl>

              <FilterFormControl key="options">
                {this.state.activeFilter &&
                  this.props.filterOptions[this.state.activeFilter] &&
                  this.props.filterOptions[this.state.activeFilter].options.map(
                    option => (
                      <FilterChip
                        label={option.name}
                        key={option.name}
                        clickable
                        onClick={() => this.filterChange(option)}
                        color={
                          this.isActiveOption(option) ? "primary" : "default"
                        }
                        variant={
                          this.isActiveOption(option) ? "default" : "outlined"
                        }
                      />
                    )
                  )}
              </FilterFormControl>
            </FilterPanel>
          </Collapse>
        </FilterContainer>
      </React.Fragment>
    );
  }
}
