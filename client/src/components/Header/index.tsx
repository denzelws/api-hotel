import {
  faBed,
  faCalendarDays,
  faCar,
  faPerson,
  faPlane,
  faTaxi
} from '@fortawesome/free-solid-svg-icons'

import { useContext, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import * as S from './styles'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { SearchContext } from '../../context/SearchContext'
import { IAuthContext } from '../../interfaces/AuthInterfaces'
import { AuthContext } from '../../context/AuthContext'
import { RangeKeyDict } from 'react-date-range'

type HeaderProps = {
  type?: string
  list?: boolean
}

const Header = ({ type, list }: HeaderProps) => {
  const [destination, setDestination] = useState('')
  const [openDate, setOpenDate] = useState(false)
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ])

  const navigate = useNavigate()

  const { user } = useContext<IAuthContext>(AuthContext)

  const [openOptions, setOpenOptions] = useState(false)

  const [options, setOptions] = useState<Record<string, number>>({
    adult: 1,
    children: 0,
    room: 1
  })

  const { dispatch } = useContext(SearchContext)

  const handleSearch = () => {
    dispatch({ type: 'NEW_SEARCH', payload: { destination, dates, options } })
    navigate('/hotels', { state: { destination, dates, options } })
  }

  const handleOption = (name: string, operation: 'i' | 'd') => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === 'i' ? options[name] + 1 : options[name] - 1
      }
    })
  }

  const handleChange = (rangesByKey: RangeKeyDict) => {
    const newDates = Object.values(rangesByKey).map((range) => ({
      startDate: range.startDate || new Date(),
      endDate: range.endDate || new Date(),
      key: range.key || 'selection'
    }))
    setDates(newDates)
  }

  return (
    <S.Header>
      <S.HeaderContainer
        style={{ margin: list ? '2rem 0 0 0' : '2rem 0 10rem 0' }}
      >
        <S.ItemsContainer>
          <S.Items>
            <FontAwesomeIcon icon={faBed} />
            <S.Description>Hospedagens</S.Description>
          </S.Items>

          <S.Items>
            <FontAwesomeIcon icon={faPlane} />
            <S.Description>Voos</S.Description>
          </S.Items>

          <S.Items>
            <FontAwesomeIcon icon={faCar} />
            <S.Description>Aluguel de carros</S.Description>
          </S.Items>

          <S.Items>
            <FontAwesomeIcon icon={faBed} />
            <S.Description>Atrações</S.Description>
          </S.Items>

          <S.Items>
            <FontAwesomeIcon icon={faTaxi} />
            <S.Description>Táxis(aeroporto)</S.Description>
          </S.Items>
        </S.ItemsContainer>
        {type !== 'list' && (
          <>
            <S.Title>Uma vida de descontos? Isso é genial</S.Title>
            <S.Description>
              Receba descontos por suas viagens - adquira imediatos descontos de
              até 20% ou mais e ganhe uma conta grátis
            </S.Description>
            {!user && <S.Button>Login/ Registre-se</S.Button>}
            <S.HeaderSearch>
              <S.SearchItem>
                <FontAwesomeIcon icon={faBed} />
                <S.Input
                  type="text"
                  placeholder="Para onde está indo?"
                  onChange={(e) => setDestination(e.target.value)}
                />
              </S.SearchItem>

              <S.SearchItem>
                <FontAwesomeIcon icon={faCalendarDays} />
                <S.Text onClick={() => setOpenDate(!openDate)}>{`${format(
                  dates[0].startDate,
                  'dd/MM/yyyy'
                )} até ${format(dates[0].endDate, 'dd/MM/yyyy')}`}</S.Text>
                {openDate && (
                  <S.DateCalendar
                    editableDateInputs={true}
                    minDate={new Date()}
                    onChange={handleChange}
                    moveRangeOnFirstSelection={false}
                    ranges={dates}
                  />
                )}
              </S.SearchItem>

              <S.SearchItem>
                <FontAwesomeIcon icon={faPerson} />
                <S.Text
                  onClick={() => setOpenOptions(!openOptions)}
                >{`${options.adult} adulto
            - ${options.children}
            criança
            - ${options.room} quarto`}</S.Text>
                {openOptions && (
                  <S.Options>
                    <S.OptionItem>
                      <S.Text>Adulto</S.Text>
                      <S.OptionCounter>
                        <S.OptionButtonCounter
                          disabled={options.adult <= 1}
                          onClick={() => handleOption('adult', 'd')}
                        >
                          -
                        </S.OptionButtonCounter>
                        <S.OptionCounterNumber>
                          {options.adult}
                        </S.OptionCounterNumber>
                        <S.OptionButtonCounter
                          onClick={() => handleOption('adult', 'i')}
                        >
                          +
                        </S.OptionButtonCounter>
                      </S.OptionCounter>
                    </S.OptionItem>

                    <S.OptionItem>
                      <S.Text>Criança</S.Text>
                      <S.OptionCounter>
                        <S.OptionButtonCounter
                          disabled={options.children <= 0}
                          onClick={() => handleOption('children', 'd')}
                        >
                          -
                        </S.OptionButtonCounter>
                        <S.OptionCounterNumber>
                          {options.children}
                        </S.OptionCounterNumber>
                        <S.OptionButtonCounter
                          onClick={() => handleOption('children', 'i')}
                        >
                          +
                        </S.OptionButtonCounter>
                      </S.OptionCounter>
                    </S.OptionItem>

                    <S.OptionItem>
                      <S.Text>Quarto</S.Text>
                      <S.OptionCounter>
                        <S.OptionButtonCounter
                          disabled={options.room <= 1}
                          onClick={() => handleOption('room', 'd')}
                        >
                          -
                        </S.OptionButtonCounter>
                        <S.OptionCounterNumber>
                          {options.room}
                        </S.OptionCounterNumber>
                        <S.OptionButtonCounter
                          onClick={() => handleOption('room', 'i')}
                        >
                          +
                        </S.OptionButtonCounter>
                      </S.OptionCounter>
                    </S.OptionItem>
                  </S.Options>
                )}
              </S.SearchItem>

              <S.SearchItem>
                <S.Button onClick={handleSearch}>Pesquisar</S.Button>
              </S.SearchItem>
            </S.HeaderSearch>
          </>
        )}
      </S.HeaderContainer>
    </S.Header>
  )
}

export default Header
