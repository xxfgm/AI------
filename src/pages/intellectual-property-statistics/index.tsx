/**
 * @name 知识产权案件统计表 (按行为分类)
 * 
 * 技术栈：React + Ant Design + Tailwind CSS
 */

import React, { useState } from 'react';
import { Table, Cascader, DatePicker, Radio, Button, Typography, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import { agencyData } from '../law-enforcement-statistics/agencyData';
import './style.css';

const { RangePicker } = DatePicker;
const { Title } = Typography;

interface DataType {
  key: string;
  category?: string; // For row span
  indicatorName: string;
  code: string | number;
  totalCases: number | string;
  normalProcedure: number | string;
  mediationCases: number | string;
  largeValueCases: number | string;
  ecommerceCases: number | string;
  foreignCases: number | string;
  caseValue: number | string;
  fineAmount: number | string;
  confiscatedAmount: number | string;
  savedLoss: number | string;
  foreignEnterpriseLoss: number | string;
  judicialTransfer: number | string;
  isTotal?: boolean;
  isHeaderRow?: boolean;
}

const mockData: DataType[] = [
  // 编号行 (Row 1 based on user interpretation)
  { key: 'header-row', indicatorName: '甲', code: '乙', totalCases: '1', normalProcedure: '2', mediationCases: '3', largeValueCases: '4', ecommerceCases: '5', foreignCases: '6', caseValue: '7', fineAmount: '8', confiscatedAmount: '9', savedLoss: '10', foreignEnterpriseLoss: '11', judicialTransfer: '12', isHeaderRow: true },
  
  // 合计行 (Row 2)
  { key: 'total-row', indicatorName: '合计', code: '1', totalCases: 180, normalProcedure: 176, mediationCases: 0, largeValueCases: 1, ecommerceCases: 17, foreignCases: 7, caseValue: '412.697452', fineAmount: '152.324818', confiscatedAmount: '260.372634', savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 5, isTotal: true },
  
  // 商标侵权 (不含地理标志商标侵权) (Row 3 onwards)
  { key: '2', category: '商标侵权 (不含地理标志商标侵权)', indicatorName: '未经商标注册人的许可，在同一种商品上使用与其注册商标相同的商标的（商标法第57条第1项）', code: '2', totalCases: 11, normalProcedure: 11, mediationCases: 0, largeValueCases: 0, ecommerceCases: 1, foreignCases: 0, caseValue: '4.725684', fineAmount: '4.252', confiscatedAmount: '0.473684', savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '3', category: '商标侵权 (不含地理标志商标侵权)', indicatorName: '未经商标注册人的许可，在同一种商品上使用与其注册商标近似的商标，或者在类似商品上使用与其注册商标相同或者近似的商标，容易导致混淆的（商标法第57条第2项）', code: '3', totalCases: 4, normalProcedure: 4, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: '0.36388', fineAmount: '0.1', confiscatedAmount: '0.26388', savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '4', category: '商标侵权 (不含地理标志商标侵权)', indicatorName: '销售侵犯注册商标专用权的商品的（商标法第57条第3项）', code: '4', totalCases: 136, normalProcedure: 136, mediationCases: 0, largeValueCases: 1, ecommerceCases: 9, foreignCases: 6, caseValue: '360.014128', fineAmount: '115.068058', confiscatedAmount: '244.94607', savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 5 },
  { key: '5', category: '商标侵权 (不含地理标志商标侵权)', indicatorName: '伪造、擅自制造他人注册商标标识或者销售伪造、擅自制造的注册商标标识的', code: '5', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '6', category: '商标侵权 (不含地理标志商标侵权)', indicatorName: '未经商标注册人同意，更换其注册商标并将该更换商标的商品又投入市场的（商标法第57条第5项）', code: '6', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '7', category: '商标侵权 (不含地理标志商标侵权)', indicatorName: '故意为侵犯他人商标专用权行为提供便利条件，帮助他人实施侵犯商标专用权行为的（商标法第57条第6项）', code: '7', totalCases: 11, normalProcedure: 11, mediationCases: 0, largeValueCases: 0, ecommerceCases: 7, foreignCases: 0, caseValue: '22.7962', fineAmount: '22.7962', confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '8', category: '商标侵权 (不含地理标志商标侵权)', indicatorName: '给他人的注册商标专用权造成其他损害的（商标法第57条第7项）', code: '8', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '9', category: '商标侵权 (不含地理标志商标侵权)', indicatorName: '按《商标法》第13条请求驰名商标保护的（商标法第13条、商标法实施条例第72条）', code: '9', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  
  // 商标使用
  { key: '10', category: '商标使用', indicatorName: '商标注册人在使用注册商标的过程中，自行改变注册商标、注册人名义、地址或者其他注册事项的（商标法第49条第1款）', code: '10', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '11', category: '商标使用', indicatorName: '法律、行政法规规定必须使用注册商标的商品，未经核准注册，在市场销售的（商标法第6条、第51条）', code: '11', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '12', category: '商标使用', indicatorName: '将未注册商标冒充注册商标使用的（商标法第52条）', code: '12', totalCases: 2, normalProcedure: 2, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: '0.55', fineAmount: '0.55', confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '13', category: '商标使用', indicatorName: '使用未注册商标违反《商标法》第十条不得作为商标使用有关规定的（商标法第10条、第52条）', code: '13', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '14', category: '商标使用', indicatorName: '将“驰名商标”字样用于商品、商品包装或者容器上，或者用于广告宣传、展览以及其他商业活动中的（商标法第14条第5款）', code: '14', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '15', category: '商标使用', indicatorName: '未在许可使用注册商标的商品上标明被许可人的名称和商品产地的（商标法第43条第2款，商标法实施条例第71条）', code: '15', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  
  // 商标申请
  { key: '16', category: '商标申请', indicatorName: '申请人恶意申请商标注册的（商标法第68条第4款，规范商标申请注册行为若干规定第12条）', code: '16', totalCases: 2, normalProcedure: 2, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: '0.4', fineAmount: '0.4', confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '17', category: '商标申请', indicatorName: '代理机构代理恶意申请商标注册的（商标法第68条第1款第3项，规范商标申请注册行为若干规定第13条）', code: '17', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '18', category: '商标申请', indicatorName: '办理商标事宜过程中，伪造、变造或者使用伪造、变造的法律文件、印章、签名的（商标法第68条第1款第1项）', code: '18', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '19', category: '商标申请', indicatorName: '以诋毁其他商标代理机构等手段招徕商标代理业务或者以其他不正当手段扰乱商标代理市场秩序的（商标法第68条第1款第2项）', code: '19', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '20', category: '商标申请', indicatorName: '通过网络从事商标代理业务违法行为的（商标代理监督管理规定第33条）', code: '20', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '21', category: '商标申请', indicatorName: '商标代理机构存在未依照规定进行备案行为的（商标代理监督管理规定第36条）', code: '21', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  
  // 商标印刷
  { key: '22', category: '商标印刷', indicatorName: '印刷商标标识、广告宣传品，违反国家有关注册商标、广告印刷管理规定的（商标印制管理办法第11条、第12条）', code: '22', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  
  // 地理标志
  { key: '23', category: '地理标志', indicatorName: '侵犯地理标志（作为证明商标、集体商标申请注册的）专用权的（商标法第57条）', code: '23', totalCases: 1, normalProcedure: 1, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: '0.002', fineAmount: '0.0005', confiscatedAmount: '0.0015', savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '24', category: '地理标志', indicatorName: '地理标志（作为注明商标、集体商标申请注册的）管理存在违法情形的（商标法实施条例第4条、集体商标、证明商标注册和管理办法第22条）', code: '24', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '25', category: '地理标志', indicatorName: '违反地理标志产品保护规定的（地理标志产品保护规定第21条、第24条）', code: '25', totalCases: 1, normalProcedure: 1, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  
  // 集体商标、证明商标
  { key: '26', category: '集体商标、证明商标', indicatorName: '集体商标、证明商标注册人没有对该商标的使用进行有效管理或者控制，致使该商标使用的商品达不到其使用管理规则的要求，对消费者造成损害的（商标法第10条、证明商标注册和管理办法第21条）', code: '26', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '27', category: '集体商标、证明商标', indicatorName: '管理集体商标、证明商标不符合要求的（集体商标、证明商标注册和管理办法第22条）', code: '27', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  
  // 特殊标志
  { key: '28', category: '特殊标志', indicatorName: '违法使用特殊标志（特殊标志管理条例第15条）', code: '28', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '29', category: '特殊标志', indicatorName: '侵犯特殊标志专有权（特殊标志管理条例第16条）', code: '29', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '30', category: '特殊标志', indicatorName: '侵犯奥林匹克标志专有权（奥林匹克标志保护条例第12条）', code: '30', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '31', category: '特殊标志', indicatorName: '侵犯世界博览会标志专有权（世界博览会标志保护条例第11条）', code: '31', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  
  // 假冒专利
  { key: '32', category: '假冒专利', indicatorName: '在未被授予专利权的产品或者其包装上标注专利标识，专利权被宣告无效或者终止后继续在产品或者其包装上标注专利标识，或者未经许可在产品或者其包装上标注他人专利号的（专利法实施细则第84条第1款第1项）', code: '32', totalCases: 1, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '33', category: '假冒专利', indicatorName: '销售假冒专利的产品的（专利法实施细则第84条第1款第2项）', code: '33', totalCases: 1, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '34', category: '假冒专利', indicatorName: '在产品说明书等材料中将未被授予专利权的技术或者设计称为专利技术或者专利设计，将专利申请称为专利，或者未经许可使用他人的专利号，使公众将所涉及的技术或者设计误认为是专利技术或者专利设计的（专利法实施细则第84条第1款第3项）', code: '34', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '35', category: '假冒专利', indicatorName: '伪造或者变造专利证书、专利文件或者专利申请文件的（专利法实施细则第84条第1款第4项）', code: '35', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '36', category: '假冒专利', indicatorName: '其他使公众混淆，将未被授予专利权的技术或者设计误认为是专利技术或者专利设计的行为（专利法实施细则第84条第1款第5项）', code: '36', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  
  // 专利代理
  { key: '37', category: '专利代理', indicatorName: '专利代理机构存在违规情形的（专利代理条例第25条）', code: '37', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '38', category: '专利代理', indicatorName: '专利代理师存在违规情形的（专利代理条例第26条）', code: '38', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '39', category: '专利代理', indicatorName: '擅自开展专利代理业务的（专利代理条例第27条）', code: '39', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  
  // 其他
  { key: '40', category: '其他', indicatorName: '电子商务平台经营者对平台内经营者实施侵犯知识产权行为未依法采取必要措施的', code: '40', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '41', category: '其他', indicatorName: '违反地方性法规、规章，依据地方性法规、规章作出行政处罚的商标案件', code: '41', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '42', category: '其他', indicatorName: '违反地方性法规、规章，依据地方性法规、规章作出行政处罚的专利案件', code: '42', totalCases: 0, normalProcedure: 0, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 0, caseValue: 0, fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
  { key: '43', category: '其他', indicatorName: '上述项目未能涵盖的其他案件', code: '43', totalCases: 10, normalProcedure: 8, mediationCases: 0, largeValueCases: 0, ecommerceCases: 0, foreignCases: 1, caseValue: '23.84556', fineAmount: '9.15806', confiscatedAmount: '14.6875', savedLoss: 0, foreignEnterpriseLoss: 0, judicialTransfer: 0 },
];

const Component: React.FC = () => {
  const [reportType, setReportType] = useState('monthly');

  const renderLink = (val: number | string, record: DataType) => {
    if (record.isHeaderRow || val === 0 || val === '0') return <span className="text-gray-900">{val}</span>;
    return <span className="link-num">{val}</span>;
  };

  const columns: ColumnsType<DataType> = [
    {
      title: '', // Empty industry name header as per image analysis
      dataIndex: 'category',
      key: 'category',
      width: 120,
      fixed: 'left',
      align: 'center',
      onCell: (record) => {
        if (record.isTotal || record.isHeaderRow) return { colSpan: 1 };
        // Row span logic
        const category = record.category;
        const firstIdx = mockData.findIndex(item => item.category === category);
        if (mockData[firstIdx].key === record.key) {
          const count = mockData.filter(item => item.category === category).length;
          return { rowSpan: count };
        }
        return { rowSpan: 0 };
      },
      render: (text, record) => (record.isTotal || record.isHeaderRow) ? null : text,
    },
    {
      title: '指标名称',
      dataIndex: 'indicatorName',
      key: 'indicatorName',
      width: 320,
      fixed: 'left',
      onCell: (record) => {
        // We no longer merge Code for Total Row to ensure '1' is displayed
        return {};
      },
      render: (text, record) => (
        <span className={(record.isTotal || record.isHeaderRow) ? 'font-bold text-gray-900' : 'text-gray-800 text-[13px] leading-tight block'}>
          {text}
        </span>
      ),
    },
    {
      title: '代码',
      dataIndex: 'code',
      key: 'code',
      align: 'center',
      width: 60,
    },
    {
      title: '案件总数(件)',
      dataIndex: 'totalCases',
      key: 'totalCases',
      align: 'center',
      width: 100,
      render: renderLink,
    },
    {
      title: '普通程序',
      dataIndex: 'normalProcedure',
      key: 'normalProcedure',
      align: 'center',
      width: 100,
      render: renderLink,
    },
    {
      title: '达成调解案件',
      dataIndex: 'mediationCases',
      key: 'mediationCases',
      align: 'center',
      width: 100,
      render: renderLink,
    },
    {
      title: '案值50万元以上案件',
      dataIndex: 'largeValueCases',
      key: 'largeValueCases',
      align: 'center',
      width: 120,
      render: renderLink,
    },
    {
      title: '电商领域案件',
      dataIndex: 'ecommerceCases',
      key: 'ecommerceCases',
      align: 'center',
      width: 100,
      render: renderLink,
    },
    {
      title: '涉外案件',
      dataIndex: 'foreignCases',
      key: 'foreignCases',
      align: 'center',
      width: 100,
      render: renderLink,
    },
    {
      title: '案值(万元)',
      dataIndex: 'caseValue',
      key: 'caseValue',
      align: 'right',
      width: 120,
      render: renderLink,
    },
    {
      title: '罚款金额(万元)',
      dataIndex: 'fineAmount',
      key: 'fineAmount',
      align: 'right',
      width: 120,
    },
    {
      title: '没收金额(万元)',
      dataIndex: 'confiscatedAmount',
      key: 'confiscatedAmount',
      align: 'right',
      width: 120,
    },
    {
      title: '挽回经济损失(万元)',
      dataIndex: 'savedLoss',
      key: 'savedLoss',
      align: 'right',
      width: 130,
    },
    {
      title: '挽回涉外企业损失',
      dataIndex: 'foreignEnterpriseLoss',
      key: 'foreignEnterpriseLoss',
      align: 'right',
      width: 120,
    },
    {
      title: '移送司法机关案件(件)',
      dataIndex: 'judicialTransfer',
      key: 'judicialTransfer',
      align: 'center',
      width: 130,
      render: renderLink,
    },
  ];

  return (
    <div className="special-equipment-statistics">
      <Title level={4} className="page-header-title text-center mb-8">知识产权案件统计表 (按行为分类)</Title>

      <div className="filter-bar">
        <Space size={24} wrap>
          <div className="filter-item">
            <span className="filter-label">办案机构:</span>
            <Cascader 
              placeholder="全级次" 
              style={{ width: 220 }}
              options={agencyData}
              changeOnSelect
              allowClear
            />
          </div>

          <div className="filter-item">
            <span className="filter-label">处罚决定日期:</span>
            <RangePicker style={{ width: 260 }} />
          </div>

          <div className="filter-item">
            <Radio.Group value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <Radio value="monthly">月报</Radio>
              <Radio value="quarterly">季报</Radio>
              <Radio value="yearly">年报</Radio>
            </Radio.Group>
          </div>
        </Space>

        <div className="action-btns">
          <Button type="primary" icon={<SearchOutlined />} className="bg-blue-600">查询</Button>
          <Button icon={<ExportOutlined />}>导出</Button>
        </div>
      </div>

      <div className="table-container">
        <Table
          columns={columns}
          dataSource={mockData}
          bordered
          pagination={false}
          size="small"
          scroll={{ x: 1700, y: 'calc(100vh - 280px)' }}
          rowClassName={(record) => (record.isTotal ? 'total-row' : (record.isHeaderRow ? 'table-header-row' : ''))}
        />
      </div>
    </div>
  );
};

export default Component;
