module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      flex: {
        js: 'justify-center',
      },
      fontSize: {
        msg: ['15px', '1.4'],
        input: ['14px', '1.14'],
        title: ['20px', '1.4'],
      },
      borderRadius: {
        panel: '16px',
        8: '8px',
        15: '15px',
        20: '20px',
      },
    },
    zIndex: {
      50: 50,
      100: 100,
    },
    border: {
      1: '1px',
    },
    colors: {
      white: '#ffffff',
      gradient: {
        primary: '#bf9ee2',
        secondary: '#bfb9e5',
        end: '#ffffff',
      },
      background: {
        primary: 'rgba(100, 77, 237, 0.3)',
      },
      font: {
        accent: '#644ded',
      },
      palette: {
        'grey-stroke': '#eeeff2',
        'light-theme': '#f9f9fc',
        'grey-semisubject': '#323232',
        'grey-content': '#484964',
        'black-subject': '#242533',
        'pale-lavender': '#eae7f9',
        'grey-menuicons': '#808192',
        'accent-opac-8': 'rgba(100, 77, 237, 0.08)',
        'button-sub': '#808192',

        black: '#25252d',
        'grey-2-hover': '#e6e6ea',
        grey: '#f7f7f8',
        'purple-on': '#7047eb',
        'word-2': '#6c6c84',
        'yellow-osbox': '#faf3e1',
        'gray-osbox': '#e6e6ea',
        'gray-osbox-font': '#abacbe',
        'purple-index': '#e9e8fc',
        'purple-input': '#f3f3f8',
        'alert-red': '#FF218C',
      },
    },
    spacing: {
      // Pixels
      0: '0px',
      1: '1px',
      2: '2px',
      3: '3px',
      4: '4px',
      5: '5px',
      6: '6px',
      7: '7px',
      8: '8px',
      9: '9px',
      10: '10px',
      11: '11px',
      12: '12px',
      13: '13px',
      14: '14px',
      15: '15px',
      16: '16px',
      17: '17px',
      18: '18px',
      19: '19px',
      20: '20px',
      21: '21px',
      22: '22px',
      23: '23px',
      24: '24px',
      25: '25px',
      26: '26px',
      27: '27px',
      28: '28px',
      29: '29px',
      30: '30px',
      31: '31px',
      32: '32px',
      33: '33px',
      34: '34px',
      35: '35px',
      36: '36px',
      37: '37px',
      38: '38px',
      39: '39px',
      40: '40px',
      41: '41px',
      42: '42px',
      43: '43px',
      44: '44px',
      45: '45px',
      46: '46px',
      47: '47px',
      48: '48px',
      49: '49px',
      50: '50px',
      51: '51px',
      52: '52px',
      53: '53px',
      54: '54px',
      55: '55px',
      56: '56px',
      57: '57px',
      58: '58px',
      59: '59px',
      60: '60px',
      61: '61px',
      62: '62px',
      63: '63px',
      64: '64px',
      65: '65px',
      66: '66px',
      67: '67px',
      68: '68px',
      69: '69px',
      70: '70px',
      71: '71px',
      72: '72px',
      73: '73px',
      74: '74px',
      75: '75px',
      76: '76px',
      77: '77px',
      78: '78px',
      79: '79px',
      80: '80px',
      81: '81px',
      82: '82px',
      83: '83px',
      84: '84px',
      85: '85px',
      86: '86px',
      87: '87px',
      88: '88px',
      89: '89px',
      90: '90px',
      91: '91px',
      92: '92px',
      93: '93px',
      94: '94px',
      95: '95px',
      96: '96px',
      97: '97px',
      98: '98px',
      99: '99px',
      100: '100px',
      105: '105px',
      112: '112px',
      113: '113px',
      115: '115px',
      120: '120px',
      124: '124px',
      128: '128px',
      140: '140px',
      144: '144px',
      150: '150px',
      153: '153px',
      160: '160px',
      190: '190px',
      192: '192px',
      196: '196px',
      200: '200px',
      208: '208px',
      220: '220px',
      232: '232px',
      240: '240px',
      256: '256px',
      280: '280px',
      288: '288px',
      300: '300px',
      304: '304px',
      306: '306px',
      310: '310px',
      320: '320px',
      395: '395px',
      500: '500px',
      504: '504px',
      544: '544px',
      608: '608px',
      700: '700px',
      800: '800px',
      1200: '1200px',
      1440: '1440px',
      1454: '1454px',

      // Percentages
      '1p': '1%',
      '2p': '2%',
      '3p': '3%',
      '4p': '4%',
      '5p': '5%',
      '6p': '6%',
      '7p': '7%',
      '8p': '8%',
      '9p': '9%',
      '10p': '10%',
      '11p': '11%',
      '12p': '12%',
      '13p': '13%',
      '14p': '14%',
      '15p': '15%',
      '16p': '16%',
      '17p': '17%',
      '18p': '18%',
      '19p': '19%',
      '20p': '20%',
      '21p': '21%',
      '22p': '22%',
      '23p': '23%',
      '24p': '24%',
      '25p': '25%',
      '26p': '26%',
      '27p': '27%',
      '28p': '28%',
      '29p': '29%',
      '30p': '30%',
      '31p': '31%',
      '32p': '32%',
      '33p': '33%',
      '34p': '34%',
      '35p': '35%',
      '36p': '36%',
      '37p': '37%',
      '38p': '38%',
      '39p': '39%',
      '40p': '40%',
      '41p': '41%',
      '42p': '42%',
      '43p': '43%',
      '44p': '44%',
      '45p': '45%',
      '46p': '46%',
      '47p': '47%',
      '48p': '48%',
      '49p': '49%',
      '50p': '50%',
      '51p': '51%',
      '52p': '52%',
      '53p': '53%',
      '54p': '54%',
      '55p': '55%',
      '56p': '56%',
      '57p': '57%',
      '58p': '58%',
      '59p': '59%',
      '60p': '60%',
      '61p': '61%',
      '62p': '62%',
      '63p': '63%',
      '64p': '64%',
      '65p': '65%',
      '66p': '66%',
      '67p': '67%',
      '68p': '68%',
      '69p': '69%',
      '70p': '70%',
      '71p': '71%',
      '72p': '72%',
      '73p': '73%',
      '74p': '74%',
      '75p': '75%',
      '76p': '76%',
      '77p': '77%',
      '78p': '78%',
      '79p': '79%',
      '80p': '80%',
      '81p': '81%',
      '82p': '82%',
      '83p': '83%',
      '84p': '84%',
      '85p': '85%',
      '86p': '86%',
      '87p': '87%',
      '88p': '88%',
      '89p': '89%',
      '90p': '90%',
      '91p': '91%',
      '92p': '92%',
      '93p': '93%',
      '94p': '94%',
      '95p': '95%',
      '96p': '96%',
      '97p': '97%',
      '98p': '98%',
      '99p': '99%',
      '100p': '100%',
    },
  },
  variants: {
    extend: {
      1.14: '1.14',
    },
  },
  plugins: [],
};
