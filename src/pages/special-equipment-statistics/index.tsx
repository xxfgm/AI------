/**
 * @name 捕捞严禁案件统计表 (按行业分类)
 * 
 * 技术栈：React + Ant Design + Tailwind CSS
 */

import React, { useState } from 'react';
import { Table, Cascader, DatePicker, Radio, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import './style.css';

const { RangePicker } = DatePicker;

interface DataType {
  key: string;
  category?: string; // For row span
  industryName: string;
  rowId: number | string;
  totalCases: number | string;
  closedCases: number | string;
  revokedLicense: number | string;
  highFineCases: number | string;
  filedCases: number | string;
  transferredCases: number | string;
  caseValue: number | string;
  fineAmount: number | string;
  confiscatedAmount: number | string;
  savedLoss: number | string;
  processingCases: number | string;
  judicialTransfer: number | string;
  isTotal?: boolean;
  isHeaderRow?: boolean;
}

const mockData: DataType[] = [
  // 编号行 (甲/乙)
  { 
    key: 'header-row', 
    industryName: '甲', 
    rowId: '乙', 
    totalCases: '1', 
    closedCases: '2', 
    revokedLicense: '3', 
    highFineCases: '4', 
    filedCases: '5', 
    transferredCases: '6', 
    caseValue: '7', 
    fineAmount: '8', 
    confiscatedAmount: '9', 
    savedLoss: '10', 
    processingCases: '11', 
    judicialTransfer: '12', 
    isHeaderRow: true 
  },
  
  // 合计行 (行次 1)
  { key: 'total-row', industryName: '合计', rowId: '1', totalCases: 760, closedCases: 196, revokedLicense: 0, highFineCases: 1, filedCases: 12, transferredCases: 7, caseValue: '412.3941', fineAmount: 182.2241, confiscatedAmount: 250.21, savedLoss: 0, processingCases: 0, judicialTransfer: 0, isTotal: true },
  
  // 捕捞单位
  { key: '2', category: '捕捞单位', industryName: '上述单位中包含三品一特案件', rowId: 2, totalCases: 7, closedCases: 11, revokedLicense: 0, highFineCases: 1, filedCases: 1, transferredCases: 0, caseValue: '4.755694', fineAmount: 4.812, confiscatedAmount: 0.473594, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  { key: '3', category: '捕捞单位', industryName: '捕捞单位及个人合计（含捕捞、养殖人员及其捕捞工具，船舶、捕捞设施以及其它捕捞辅助手段 or 个人）', rowId: 3, totalCases: 4, closedCases: 4, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0.320011', fineAmount: 0.1, confiscatedAmount: 0.2201, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  { key: '4', category: '捕捞单位', industryName: '单位（捕捞及养殖相关其相关工具、捕捞设施或辅助手段等）', rowId: 4, totalCases: 611, closedCases: 176, revokedLicense: 0, highFineCases: 1, filedCases: 9, transferredCases: 6, caseValue: '390.04175', fineAmount: 175.555, confiscatedAmount: 248.54117, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  
  // 个体、个人（捕捞人员、相关个人及养殖相关人员或个人）
  { key: '5', category: '个体、个人（捕捞人员、相关个人及养殖相关人员或个人）', industryName: '合计', rowId: 5, totalCases: 0, closedCases: 0, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  { key: '6', category: '个体、个人（捕捞人员、相关个人及养殖相关人员或个人）', industryName: '个体（捕捞及养殖相关人员）', rowId: 6, totalCases: 0, closedCases: 0, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  { key: '7', category: '个体、个人（捕捞人员、相关个人及养殖相关人员或个人）', industryName: '个人（相关捕捞人员或从事养殖的相关人员或辅助个人）', rowId: 7, totalCases: 7, closedCases: 11, revokedLicense: 0, highFineCases: 0, filedCases: 1, transferredCases: 0, caseValue: '22.952', fineAmount: 22.952, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  { key: '8', category: '个体、个人（捕捞人员、相关个人及养殖相关人员或个人）', industryName: '其它（其它捕捞及养殖相关的行业或者主体、个人或其个人等）', rowId: 8, totalCases: 0, closedCases: 0, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  
  // 销售单位
  { key: '9', category: '销售单位', industryName: '上述单位中包含三品一特案件', rowId: 9, totalCases: 2, closedCases: 2, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0.55', fineAmount: 0.55, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  { key: '10', category: '销售单位', industryName: '销售单位及相关经营主体（含销售、收购、贮存、运输单位等经营主体', rowId: 10, totalCases: 0, closedCases: 0, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  { key: '11', category: '销售单位', industryName: '网络交易平台（含电商平台、自设网站等第三方平台，平台内经营者及其它经营人或主体）', rowId: 11, totalCases: 0, closedCases: 0, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  { key: '12', category: '销售单位', industryName: '农副产产品市场（农贸市场等所有从事农副产品及其辅类单位、经营人或主体）', rowId: 12, totalCases: 0, closedCases: 0, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  { key: '13', category: '销售单位', industryName: '超市、商场及便利店等（超市、商场、便利店及各种连锁经营单位、其它经营主体或相关经营人等）', rowId: 13, totalCases: 0, closedCases: 0, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  
  // 餐饮单位
  { key: '14', category: '餐饮单位', industryName: '上述单位中包含三品一特案件', rowId: 14, totalCases: 2, closedCases: 2, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0.4', fineAmount: 0.4, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  { key: '15', category: '餐饮单位', industryName: '餐饮单位及相关经营主体（含各类饭店、餐馆、酒店、食堂、及其它餐饮业主体或其相关经营人等）', rowId: 15, totalCases: 0, closedCases: 0, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  { key: '16', category: '餐饮单位', industryName: '其它（从事餐饮及其它行业的相关经营主体、经营单位、其它经营人或主体等）', rowId: 16, totalCases: 0, closedCases: 0, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  
  // 其它单位
  { key: '17', category: '其它单位', industryName: '上述单位中包含三品一特案件', rowId: 17, totalCases: 0, closedCases: 0, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  { key: '18', category: '其它单位', industryName: '事业单位、社会团体、非营利性机构（如学校、医院及其相关单位、团体等单位或其它相关主体）', rowId: 18, totalCases: 0, closedCases: 0, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  { key: '19', category: '其它单位', industryName: '家庭农场、农民专业合作社（从事农业、渔业相关发展的农场、合作社及其内部单位及其相关负责人或主体等）', rowId: 19, totalCases: 1, closedCases: 0, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0.002', fineAmount: 0.0001, confiscatedAmount: 0.0019, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  
  // 其它组织、个人
  { key: '20', category: '其它组织、个人', industryName: '上述单位中包含三品一特案件', rowId: 20, totalCases: 0, closedCases: 0, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  { key: '21', category: '其它组织、个人', industryName: '其它组织（非从事前述主体以外的相关行业的所有主体、所有团体、组织及及其它组织及其相关负责人或主体等）', rowId: 21, totalCases: 0, closedCases: 0, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  
  // 个体经营者
  { key: '22', category: '个体经营者', industryName: '上述单位中包含三品一特案件', rowId: 22, totalCases: 0, closedCases: 0, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  { key: '23', category: '个体经营者', industryName: '个体工商户（所有个体工商户的相关负责人、经营者或经营人等）', rowId: 23, totalCases: 0, closedCases: 0, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  
  // 个人
  { key: '24', category: '个人', industryName: '个人（所有非从事前述行业、企业、组织及其主体的相关所有个人（非商事主体人员）或其它辅助个人等）', rowId: 24, totalCases: 0, closedCases: 0, revokedLicense: 0, highFineCases: 0, filedCases: 0, transferredCases: 0, caseValue: '0', fineAmount: 0, confiscatedAmount: 0, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
  { key: '25', category: '个人', industryName: '合计', rowId: 25, totalCases: 10, closedCases: 0, revokedLicense: 0, highFineCases: 0, filedCases: 2, transferredCases: 1, caseValue: '38.64395', fineAmount: 9.3256, confiscatedAmount: 14.8005, savedLoss: 0, processingCases: 0, judicialTransfer: 0 },
];

const Component: React.FC = () => {
  const [reportType, setReportType] = useState('monthly');

  const renderLink = (val: number | string, record: DataType) => {
    if (record.isHeaderRow || val === 0 || val === '0') return <span className="text-gray-900">{val}</span>;
    return <span className="link-num">{val}</span>;
  };

  const columns: ColumnsType<DataType> = [
    {
      title: '行业名称',
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
      dataIndex: 'industryName',
      key: 'industryName',
      width: 300,
      fixed: 'left',
      render: (text, record) => (
        <span className={(record.isTotal || record.isHeaderRow) ? 'font-semibold text-gray-900' : 'text-gray-800 text-sm'}>
          {text}
        </span>
      ),
    },
    {
      title: '行次',
      dataIndex: 'rowId',
      key: 'rowId',
      align: 'center',
      width: 60,
    },
    {
      title: '案件总数',
      align: 'center',
      children: [
        {
          title: '结案',
          dataIndex: 'closedCases',
          key: 'closedCases',
          align: 'center',
          width: 80,
          render: renderLink,
        },
        {
          title: '结案后吊销许可证件',
          dataIndex: 'revokedLicense',
          key: 'revokedLicense',
          align: 'center',
          width: 120,
          render: renderLink,
        },
        {
          title: '罚没 (500元以上)',
          dataIndex: 'highFineCases',
          key: 'highFineCases',
          align: 'center',
          width: 110,
          render: renderLink,
        },
        {
          title: '立案',
          dataIndex: 'filedCases',
          key: 'filedCases',
          align: 'center',
          width: 80,
          render: renderLink,
        },
        {
          title: '移送',
          dataIndex: 'transferredCases',
          key: 'transferredCases',
          align: 'center',
          width: 80,
          render: renderLink,
        },
      ],
    },
    {
      title: '案值 (元)',
      dataIndex: 'caseValue',
      key: 'caseValue',
      align: 'right',
      width: 120,
      render: renderLink,
    },
    {
      title: '罚没金额 (万元)',
      dataIndex: 'fineAmount',
      key: 'fineAmount',
      align: 'right',
      width: 120,
    },
    {
      title: '没收金额 (万元)',
      dataIndex: 'confiscatedAmount',
      key: 'confiscatedAmount',
      align: 'right',
      width: 120,
    },
    {
      title: '挽回经济损失 (万元)',
      dataIndex: 'savedLoss',
      key: 'savedLoss',
      align: 'right',
      width: 130,
    },
    {
      title: '正在处理件数',
      dataIndex: 'processingCases',
      key: 'processingCases',
      align: 'center',
      width: 110,
      render: renderLink,
    },
    {
      title: '移送司法机关件数',
      dataIndex: 'judicialTransfer',
      key: 'judicialTransfer',
      align: 'center',
      width: 130,
      render: renderLink,
    },
  ];

  return (
    <div className="special-equipment-statistics">
      <h1 className="page-title">捕捞严禁案件统计表 (按行业分类)</h1>

      <div className="filter-bar">
        <div className="filter-item">
          <span className="filter-label">办案机构:</span>
          <Cascader 
            placeholder="请选择办案机构" 
            style={{ width: 220 }}
            options={[
              { value: 'all', label: '全级次' },
            ]}
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
          scroll={{ x: 1600, y: 'calc(100vh - 280px)' }}
          rowClassName={(record) => (record.isTotal ? 'total-row' : (record.isHeaderRow ? 'table-header-row' : ''))}
        />
      </div>
    </div>
  );
};

export default Component;
