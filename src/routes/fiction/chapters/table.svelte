<script lang="ts">
  import Chapter from '../_chapter.svelte';
  import Badge from '$holocene/badge.svelte';
  import Table from '$holocene/table/table.svelte';
  import TableRow from '$holocene/table/table-row.svelte';
  import TableHeaderRow from '$holocene/table/table-header-row.svelte';
</script>

<Chapter description="A Fancy Table">
  <Table variant="fancy" class="w-full">
    <TableHeaderRow slot="headers">
      <th class="w-1/5">Status</th>
      <th class="w-1/5">Email</th>
      <th>Role</th>
    </TableHeaderRow>
    <TableRow>
      <td>
        <Badge type="active">Active</Badge>
      </td>
      <td>george@temporal.io</td>
      <td>Global Admin</td>
    </TableRow>
    <TableRow>
      <td>
        <Badge type="active">Active</Badge>
      </td>
      <td>lucile@temporal.io</td>
      <td>Developer</td>
    </TableRow>
    <TableRow>
      <td>
        <Badge type="active">Active</Badge>
      </td>
      <td>tobias@temporal.io</td>
      <td>Read-Only</td>
    </TableRow>
  </Table>
</Chapter>

<Chapter description="A Simple Table">
  <Table variant="simple" class="w-full">
    <tr slot="headers">
      <th>Attribute</th>
      <th>Type</th>
    </tr>
    <tr>
      <td>searchAttribute1</td>
      <td>Unspecified</td>
    </tr>
    <tr>
      <td>searchAttribute2</td>
      <td>Text</td>
    </tr>
    <tr>
      <td>searchAttribute3</td>
      <td>Keyword</td>
    </tr>
  </Table>
</Chapter>
